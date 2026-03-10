# GraphQL API Operations - devMatch Frontend

## Overview
All GraphQL operations are defined in `/src/lib/graphql/operations.ts` and generated hooks are exported from `/src/lib/graphql/generated.ts`.

---

## QUERIES

### User Operations

| Operation | Hook | Description |
|-----------|------|-------------|
| `GetMe` | `useGetMeQuery` | Fetches current authenticated user with their profile (Developer or Recruiter) |
| `GetMyDeveloperProfile` | `useGetMyDeveloperProfileQuery` | Fetches authenticated user's developer profile with experiences and projects |
| `GetMyRecruiterProfile` | `useGetMyRecruiterProfileQuery` | Fetches authenticated user's recruiter profile |

### Developer Discovery

| Operation | Hook | Description |
|-----------|------|-------------|
| `GetDeveloper` | `useGetDeveloperQuery` | Fetches single developer by ID with full details (video, experiences, projects, links) |
| `GetDevelopers` | `useGetDevelopersQuery` | Paginated list with filters: seniority, availability, tech stack, location, search, hasIntroVideo |

### Shortlist

| Operation | Hook | Description |
|-----------|------|-------------|
| `GetMyShortlist` | `useGetMyShortlistQuery` | Fetches user's shortlist with developer details |
| `GetMyShortlistCount` | `useGetMyShortlistCountQuery` | Gets count of developers in shortlist |
| `IsInMyShortlist` | `useIsInMyShortlistQuery` | Checks if specific developer is in shortlist |

---

## MUTATIONS

### User Account

| Operation | Hook | Description |
|-----------|------|-------------|
| `CreateDeveloperProfile` | `useCreateDeveloperProfileMutation` | Creates initial developer profile (firstName, lastName) |
| `CreateRecruiterProfile` | `useCreateRecruiterProfileMutation` | Creates initial recruiter profile (firstName, lastName) |
| `DeleteAccount` | `useDeleteAccountMutation` | Hard deletes user account and all associated data |

### Developer Profile

| Operation | Hook | Description |
|-----------|------|-------------|
| `UpdateDeveloperProfile` | `useUpdateDeveloperProfileMutation` | Updates profile fields (name, jobTitle, location, seniority, availability, techStack, bio, URLs, onboardingCompleted) |
| `UpdateRecruiterProfile` | `useUpdateRecruiterProfileMutation` | Updates recruiter profile information |

### Experience

| Operation | Hook | Description |
|-----------|------|-------------|
| `AddExperience` | `useAddExperienceMutation` | Adds work experience (company, position, years, description) |
| `UpdateExperience` | `useUpdateExperienceMutation` | Updates existing work experience |
| `DeleteExperience` | `useDeleteExperienceMutation` | Deletes work experience by ID |

### Projects

| Operation | Hook | Description |
|-----------|------|-------------|
| `AddProject` | `useAddProjectMutation` | Adds portfolio project (name, description, URL, techStack) |
| `UpdateProject` | `useUpdateProjectMutation` | Updates existing project |
| `DeleteProject` | `useDeleteProjectMutation` | Deletes project by ID |

### Media

| Operation | Hook | Description |
|-----------|------|-------------|
| `UploadProfilePhoto` | `useUploadProfilePhotoMutation` | Uploads profile photo, returns Media with URL |
| `DeleteProfilePhoto` | `useDeleteProfilePhotoMutation` | Deletes user's profile photo |
| `UploadIntroVideo` | `useUploadIntroVideoMutation` | Uploads intro video for server-side processing |
| `DeleteIntroVideo` | `useDeleteIntroVideoMutation` | Deletes intro video and thumbnail |

### Shortlist

| Operation | Hook | Description |
|-----------|------|-------------|
| `AddToShortlist` | `useAddToShortlistMutation` | Adds developer to shortlist |
| `RemoveFromShortlist` | `useRemoveFromShortlistMutation` | Removes developer from shortlist |
| `ClearMyShortlist` | `useClearMyShortlistMutation` | Clears all developers from shortlist |

---

## Usage by Page

### `/dashboard` (Feed)
- `useGetDevelopersQuery` - with `hasIntroVideo: true` filter
- `useAddToShortlistMutation`

### `/dashboard/developers` (List)
- `useGetDevelopersQuery` - with search, seniority, availability filters
- `useAddToShortlistMutation`
- `useRemoveFromShortlistMutation`

### `/dashboard/developers/[id]` (Detail)
- `useGetDeveloperQuery`
- `useAddToShortlistMutation`
- `useRemoveFromShortlistMutation`

### `/dashboard/shortlist`
- `useGetMyShortlistQuery`
- `useRemoveFromShortlistMutation`
- `useClearMyShortlistMutation`

### `/dashboard/profile`
- `useGetMeQuery`
- `useUpdateDeveloperProfileMutation`
- `useAddExperienceMutation` / `useUpdateExperienceMutation` / `useDeleteExperienceMutation`
- `useAddProjectMutation` / `useUpdateProjectMutation` / `useDeleteProjectMutation`
- `useUploadProfilePhotoMutation` / `useDeleteProfilePhotoMutation`
- `useUploadIntroVideoMutation` / `useDeleteIntroVideoMutation`

### `/dashboard/settings`
- `useDeleteAccountMutation`

### Auth Flow (`AuthStateSync`)
- `useGetMeQuery`
- `useCreateDeveloperProfileMutation`
- `useCreateRecruiterProfileMutation`

### Shortlist Hook (`useShortlist`)
- `useGetMyShortlistQuery`
- `useGetMyShortlistCountQuery`
- `useIsInMyShortlistQuery`
- `useAddToShortlistMutation`
- `useRemoveFromShortlistMutation`
- `useClearMyShortlistMutation`

---

## Summary

| Type | Count |
|------|-------|
| Queries | 8 |
| Mutations | 18 |
| **Total** | **26** |
