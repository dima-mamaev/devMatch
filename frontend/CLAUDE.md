# DevMatch Frontend

## Overview

DevMatch is a developer talent marketplace that connects recruiters with developers. The frontend is a Next.js 16 application with React 19, using GraphQL for API communication and Auth0 for authentication.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **React:** 19.2.3
- **State Management:** Redux Toolkit + React Redux
- **API:** Apollo Client + GraphQL
- **Authentication:** Auth0
- **Forms:** React Hook Form
- **Styling:** Tailwind CSS 4
- **Notifications:** Sonner (toast notifications)
- **Type Generation:** GraphQL Codegen

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout with providers
│   ├── join/              # Role selection (Developer/Recruiter)
│   ├── signin/            # Auth0 sign-in
│   ├── contact/           # Contact page
│   ├── legal/             # Legal/privacy page
│   └── dashboard/         # Protected dashboard routes
│       ├── page.tsx       # Developer feed (video cards)
│       ├── developers/    # Developer listing & profiles
│       ├── shortlist/     # Saved developers (max 5)
│       ├── ai-match/      # AI matching feature (placeholder)
│       ├── profile/       # User profile management
│       └── settings/      # Account settings
├── components/
│   ├── ui/                # Reusable UI components
│   ├── home/              # Landing page sections
│   ├── auth/              # Auth components (ProtectedRoute)
│   ├── layout/            # Layout components (Header, Footer, DashboardLayout)
│   ├── profile/           # Profile forms and onboarding
│   └── icons/             # SVG icon components
├── hooks/
│   ├── useAuth.ts         # Auth utilities
│   └── useShortlist.ts    # Shortlist management (API + localStorage)
├── lib/
│   ├── graphql/
│   │   ├── operations.ts  # GraphQL queries & mutations
│   │   └── generated.ts   # Auto-generated types & hooks
│   ├── graphql.ts         # Apollo client setup
│   └── localShortlist.ts  # localStorage utilities for guest shortlist
├── providers/
│   ├── Auth0Provider.tsx  # Auth0 configuration
│   ├── ApolloProvider.tsx # Apollo Client setup
│   ├── AuthStateSync.tsx  # Syncs Auth0 → Redux + shortlist sync
│   └── StoreProvider.tsx  # Redux store provider
└── store/
    ├── index.ts           # Redux store configuration
    ├── hooks.ts           # Typed Redux hooks
    └── slices/
        └── userSlice.ts   # User state management
```

## Key Features

### Authentication Flow
1. User clicks "Join" → selects role (Developer/Recruiter)
2. Role stored in localStorage → redirects to Auth0
3. After Auth0 callback, `AuthStateSync` fetches user data via `getMe` query
4. User/profile stored in Redux
5. Local shortlist synced to API on login

### User Roles
- **Developer:** Can create profile, upload intro video, add experience/projects
- **Recruiter:** Can browse developers, manage shortlist, view profiles

### Shortlist System
- Recruiters can save up to 5 developers
- Works for both authenticated (API) and non-authenticated (localStorage) users
- Auto-syncs localStorage to API on login
- Located in `useShortlist.ts` and `localShortlist.ts`

### Developer Onboarding
Multi-step onboarding flow for developers:
1. Role selection
2. Profile photo upload
3. Intro video upload
4. Tech stack selection
5. Experience entry
6. Social links
7. Completion

### Media Handling
- Profile photos: Direct upload via GraphQL mutation
- Intro videos: Upload with server-side processing (shows processing status)
- Video thumbnails: Auto-generated server-side

## GraphQL Operations

### Queries
- `GetMe` - Current user with profile
- `GetDeveloper(id)` - Single developer profile
- `GetDevelopers(filter, paging, sort)` - Developer listing
- `GetMyShortlist` - User's shortlisted developers
- `IsInMyShortlist(developerId)` - Check if developer is saved

### Mutations
- `CreateDeveloperProfile` / `CreateRecruiterProfile`
- `UpdateDeveloperProfile` / `UpdateRecruiterProfile`
- `AddExperience` / `UpdateExperience` / `DeleteExperience`
- `AddProject` / `UpdateProject` / `DeleteProject`
- `UploadProfilePhoto` / `DeleteProfilePhoto`
- `UploadIntroVideo` / `DeleteIntroVideo`
- `AddToShortlist` / `RemoveFromShortlist` / `ClearMyShortlist`
- `DeleteAccount`

## Environment Variables

```env
NEXT_PUBLIC_AUTH0_DOMAIN=       # Auth0 domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=    # Auth0 client ID
NEXT_PUBLIC_AUTH0_AUDIENCE=     # Auth0 API audience
NEXT_PUBLIC_GRAPHQL_URL=        # GraphQL API endpoint
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run codegen      # Generate GraphQL types
npm run codegen:watch # Watch mode for codegen
```

## State Management

### Redux Store
- `userSlice`: User authentication state
  - `user`: Current user object
  - `profile`: Developer or Recruiter profile
  - `isLoading`: Loading state
  - `error`: Error messages
  - `showOnboardingComplete`: Onboarding completion modal

### Key Selectors
- `selectUser` / `selectProfile`
- `selectIsDeveloper` / `selectIsRecruiter`
- `selectOnboardingCompleted`
- `selectIsUserLoading`

## Important Patterns

### Apollo Hook Stability
When using Apollo hooks in useEffect/useCallback dependencies, store them in refs to prevent infinite re-renders:
```typescript
const [mutate] = useSomeMutation();
const mutateRef = useRef(mutate);
mutateRef.current = mutate;

const callback = useCallback(() => {
  mutateRef.current({ variables: {...} });
}, []); // Empty deps - stable reference
```

### Stable Empty Arrays
When returning empty arrays conditionally, use constant references:
```typescript
const EMPTY_ARRAY: string[] = [];
return isCondition ? someArray : EMPTY_ARRAY;
```

### Protected Routes
Use `ProtectedRoute` component for auth-required pages:
```tsx
<ProtectedRoute requiredRoles={["Recruiter"]}>
  <Component />
</ProtectedRoute>
```

## API Integration

The backend is a NestJS GraphQL API. The frontend uses:
- Apollo Client for GraphQL communication
- `apollo-upload-client` for file uploads
- Auth0 access token in Authorization header

## Styling Conventions

- Tailwind CSS with custom color palette (indigo primary)
- Rounded corners: `rounded-xl`, `rounded-2xl`
- Shadows: `shadow-sm`
- Font sizes: `text-xs`, `text-sm`, `text-base`
- Spacing: Tailwind's default scale
