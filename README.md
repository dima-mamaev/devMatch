# DevMatch API

A microservices-based backend for a developer hiring platform. Built with NestJS, featuring GraphQL API, AI-powered matching, and video processing capabilities.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  CLIENTS                                     │
│                         (Web App, Mobile, etc.)                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API SERVICE                                    │
│                           (GraphQL Gateway)                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │  Developer  │ │  Recruiter  │ │    User     │ │        AI Match         ││
│  │   Module    │ │   Module    │ │   Module    │ │         Module          ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────────┘│
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐│
│  │   Media     │ │  Shortlist  │ │   Upload    │ │      Queue Handlers     ││
│  │   Module    │ │   Module    │ │   Module    │ │     (BullMQ Workers)    ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
         │                    │                              │
         │                    │                              │
         ▼                    ▼                              ▼
┌─────────────────┐  ┌─────────────────┐           ┌─────────────────┐
│   PostgreSQL    │  │      Redis      │◄─────────►│   Cloudinary    │
│   (Database)    │  │  (Cache/Queue)  │           │    (Storage)    │
└─────────────────┘  └─────────────────┘           └─────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   VIDEO CONVERTER       │     │      AI AGENT           │
│      SERVICE            │     │       SERVICE           │
│                         │     │                         │
│  ┌───────────────────┐  │     │  ┌───────────────────┐  │
│  │  FFmpeg/FFprobe   │  │     │  │  OpenAI Assistant │  │
│  │   Processing      │  │     │  │    (GPT-4o)       │  │
│  └───────────────────┘  │     │  └───────────────────┘  │
│                         │     │                         │
│  ┌───────────────────┐  │     │  ┌───────────────────┐  │
│  │   Cloudinary      │  │     │  │   Tool Handlers   │  │
│  │   Upload/Delete   │  │     │  │  (DB Queries)     │  │
│  └───────────────────┘  │     │  └───────────────────┘  │
└─────────────────────────┘     └─────────────────────────┘
```

## Data Flow

### Video Upload Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────────────┐    ┌────────────────┐
│  Client  │───►│   API    │───►│ ConverterInput   │───►│ Video          │
│  Upload  │    │ Service  │    │     Queue        │    │ Converter      │
└──────────┘    └──────────┘    └──────────────────┘    └────────────────┘
                                                               │
                    ┌──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         VIDEO CONVERTER SERVICE                           │
│                                                                          │
│   1. Download from Cloudinary (temp storage)                             │
│   2. Probe video metadata (ffprobe)                                      │
│   3. Check if conversion needed (codec, bitrate, resolution)             │
│   4. Convert if necessary (ffmpeg → H.264, max 1280px, CRF 30)          │
│   5. Upload processed video to Cloudinary                                │
│   6. Cleanup temp files                                                  │
│   7. Delete original temp upload                                         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │   Success Path      │
        │ ConverterOutput     │─────────────┐
        │     Queue           │             │
        └─────────────────────┘             │
                                            ▼
        ┌─────────────────────┐    ┌──────────────────┐
        │   Failure Path      │    │   API Service    │
        │ (After 3 retries)   │───►│ Update Media     │
        │ Dead Letter Queue   │    │ Status: Ready    │
        └─────────────────────┘    │    or Failed     │
                                   └──────────────────┘
```

### AI Match Flow

```
┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────────────┐
│  Client  │───►│   API    │───►│  AI Agent    │───►│     OpenAI       │
│ Request  │    │ Service  │    │  Service     │    │   Assistants     │
└──────────┘    └──────────┘    └──────────────┘    └──────────────────┘
     ▲                                  │                    │
     │                                  │                    │
     │              ┌───────────────────┘                    │
     │              │                                        │
     │              ▼                                        │
     │     ┌──────────────────┐                              │
     │     │  Redis Pub/Sub   │                              │
     │     │   (SSE Events)   │                              │
     │     └──────────────────┘                              │
     │              │                                        │
     │              │    ┌───────────────────────────────────┘
     │              │    │
     │              ▼    ▼
     │     ┌──────────────────────────────────────────────────┐
     │     │              EVENT STREAM                        │
     │     │                                                  │
     │     │  1. THINKING    → "Analyzing your request..."    │
     │     │  2. TOOL_CALL   → search_developers, etc.        │
     │     │  3. TOOL_RESULT → "Found 15 developers"          │
     │     │  4. MATCH_FOUND → Developer profile + score      │
     │     │  5. COMPLETE    → Summary + total matches        │
     │     │                                                  │
     └─────│──────────────────────────────────────────────────│
           │                                                  │
           └──────────────────────────────────────────────────┘
```

## Services

| Service | Port | Transport | Description |
|---------|------|-----------|-------------|
| **API** | 4000 | HTTP/GraphQL | Main gateway, handles auth, CRUD, file uploads |
| **Video Converter** | - | Redis/BullMQ | Processes uploaded videos, optimizes for web |
| **AI Agent** | 4001 | HTTP | Runs OpenAI Assistant for developer matching |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | NestJS 11 |
| API | GraphQL (Apollo Server 5) |
| Database | PostgreSQL 17 + TypeORM |
| Queue | BullMQ + Redis |
| Auth | Auth0 (JWT) |
| AI | OpenAI Assistants API (GPT-4o) |
| Storage | Cloudinary |
| Video | FFmpeg / FFprobe |

## Project Structure

```
api/
├── apps/
│   ├── api/                    # Main GraphQL API service
│   │   └── src/
│   │       ├── ai-match/       # AI matching feature
│   │       ├── developer/      # Developer profiles
│   │       ├── media/          # Media management
│   │       ├── queues/         # BullMQ processors
│   │       ├── recruiter/      # Recruiter profiles
│   │       ├── shared/         # Guards, decorators, pipes
│   │       ├── shortlist/      # Saved developers
│   │       ├── upload/         # File upload handling
│   │       └── user/           # User management
│   │
│   ├── video-converter/        # Video processing microservice
│   │   └── src/
│   │       ├── cloudinary.service.ts
│   │       ├── video-converter.processor.ts
│   │       └── video-converter.service.ts
│   │
│   └── ai-agent/               # AI matching microservice
│       └── src/
│           ├── ai-agent.controller.ts
│           ├── events/         # Redis pub/sub for SSE
│           └── openai/         # Assistant + tools
│
├── libs/
│   └── shared/                 # Shared library
│       └── src/
│           ├── entities/       # TypeORM entities
│           ├── enums/          # Shared enums
│           ├── services/       # Shared services (BullConfig)
│           └── types/          # Shared types
│
└── types/                      # Global type definitions
```
 

## Scripts

### Development

| Command | Description |
|---------|-------------|
| `yarn start:dev` | Start API in watch mode |
| `yarn start:converter:dev` | Start Video Converter in watch mode |
| `yarn start:ai-agent:dev` | Start AI Agent in watch mode |

### Build

| Command | Description |
|---------|-------------|
| `yarn build` | Build all services |
| `yarn build:api` | Build API only |
| `yarn build:converter` | Build Video Converter only |
| `yarn build:ai-agent` | Build AI Agent only |

### Database

| Command | Description |
|---------|-------------|
| `yarn db:sync` | Sync schema to database |
| `yarn db:drop` | Drop all tables |
| `yarn db:reset` | Drop + sync (fresh start) |
| `yarn db:generate` | Generate migration from changes |
| `yarn db:up` | Run pending migrations |
| `yarn db:down` | Revert last migration |

### Docker

| Command | Description |
|---------|-------------|
| `yarn docker:infra` | Start PostgreSQL + Redis |
| `yarn docker:infra:down` | Stop infrastructure |
| `yarn docker:app` | Start all services |
| `yarn docker:logs` | Follow container logs |

## Queue Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           BullMQ Queues                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ConverterInputQueue                                                │
│  └─► Job: ConvertVideoInput                                         │
│      └─► { inputPath, developerId, videoMediaId }                   │
│                                                                     │
│  ConverterOutputQueue                                               │
│  ├─► Job: ConvertVideoOutput (success)                              │
│  │   └─► { outputPath, developerId, videoMediaId }                  │
│  └─► Job: ConvertVideoFailed (failure)                              │
│      └─► { outputPath, developerId, videoMediaId }                  │
│                                                                     │
│  ConverterDeadLetterQueue                                           │
│  └─► Job: DeadLetterJob (after 3 retries)                           │
│      └─► { ...inputData, errorMessage, failedAt }                   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Default Job Options:                                               │
│  • attempts: 3                                                      │
│  • backoff: exponential (5s → 10s → 20s)                            │
│  • removeOnComplete: true                                           │
└─────────────────────────────────────────────────────────────────────┘
```
## Rate Limiting

AI Match requests are rate-limited per user:

| User Type | Requests | Window |
|-----------|----------|--------|
| Guest | 5 | 2 hours |
| Authenticated | 10 | 2 hours |

Rate limit state stored in Redis with automatic expiration.
