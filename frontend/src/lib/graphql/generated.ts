import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Custom upload scalar type */
  CustomUpload: { input: File; output: File; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: Record<string, unknown>; output: Record<string, unknown>; }
};

/** Developer availability status */
export type AvailabilityStatus =
  | 'Available'
  | 'NotAvailable'
  | 'OpenToOffers';

export type ChangePasswordInput = {
  confirm: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CreateExperienceInput = {
  companyName: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endYear?: InputMaybe<Scalars['Int']['input']>;
  position: Scalars['String']['input'];
  startYear: Scalars['Int']['input'];
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  techStack?: InputMaybe<Array<Scalars['String']['input']>>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteResult = {
  affected?: Maybe<Scalars['Float']['output']>;
};

export type DeleteUserInput = {
  id: Scalars['ID']['input'];
};

/** Developer */
export type Developer = {
  availabilityStatus?: Maybe<AvailabilityStatus>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  experiences: Array<Experience>;
  firstName: Scalars['String']['output'];
  githubUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  introVideo?: Maybe<Media>;
  introVideoThumbnail?: Maybe<Media>;
  jobTitle?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  linkedinUrl?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  onboardingCompleted: Scalars['Boolean']['output'];
  personalSiteUrl?: Maybe<Scalars['String']['output']>;
  profilePhoto?: Maybe<Media>;
  projects: Array<Project>;
  seniorityLevel?: Maybe<SeniorityLevel>;
  techStack: Array<Scalars['String']['output']>;
};

/** Paginated list of developers */
export type DeveloperConnection = {
  limit?: Maybe<Scalars['Int']['output']>;
  page?: Maybe<Scalars['Int']['output']>;
  results: Array<Developer>;
  total: Scalars['Int']['output'];
};

export type DeveloperFilterInput = {
  availabilityStatus?: InputMaybe<Array<AvailabilityStatus>>;
  excludeIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  location?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  seniorityLevels?: InputMaybe<Array<SeniorityLevel>>;
  techStack?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DeveloperSortInput = {
  createdAt?: InputMaybe<Sort>;
  firstName?: InputMaybe<Sort>;
  lastName?: InputMaybe<Sort>;
  seniorityLevel?: InputMaybe<Sort>;
};

/** Experience */
export type Experience = {
  companyName: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endYear?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  position: Scalars['String']['output'];
  startYear: Scalars['Int']['output'];
};

export type GetUserInput = {
  id: Scalars['ID']['input'];
};

/** Media */
export type Media = {
  id: Scalars['ID']['output'];
  processingStatus?: Maybe<MediaProcessingStatus>;
  type: MediaType;
  url: Scalars['String']['output'];
};

/** Media processing status */
export type MediaProcessingStatus =
  | 'Failed'
  | 'Processing'
  | 'Ready';

/** Type of media */
export type MediaType =
  | 'Image'
  | 'Video';

export type Mutation = {
  /** Add work experience */
  addExperience: Experience;
  /** Add portfolio project */
  addProject: Project;
  /** Add developer to shortlist */
  addToShortlist: Shortlist;
  /** Clear entire shortlist */
  clearMyShortlist: Scalars['Boolean']['output'];
  /** Create initial developer profile */
  createDeveloperProfile: Developer;
  /** Create initial recruiter profile */
  createRecruiterProfile: Recruiter;
  /** Delete work experience */
  deleteExperience: Scalars['Boolean']['output'];
  /** Delete intro video and thumbnail */
  deleteIntroVideo: Scalars['Boolean']['output'];
  /** Delete profile photo */
  deleteProfilePhoto: Scalars['Boolean']['output'];
  /** Delete portfolio project */
  deleteProject: Scalars['Boolean']['output'];
  /** Remove developer from shortlist */
  removeFromShortlist: Scalars['Boolean']['output'];
  /** Update developer profile (creates if not exists) */
  updateDeveloperProfile: Developer;
  /** Update work experience */
  updateExperience: Experience;
  /** Update portfolio project */
  updateProject: Project;
  /** Update recruiter profile */
  updateRecruiterProfile: Recruiter;
  /** Upload intro video (queued for processing) */
  uploadIntroVideo: Scalars['Boolean']['output'];
  /** Upload profile photo (direct S3 upload) */
  uploadProfilePhoto: Media;
  user: UserMutation;
};


export type MutationAddExperienceArgs = {
  input: CreateExperienceInput;
};


export type MutationAddProjectArgs = {
  input: CreateProjectInput;
};


export type MutationAddToShortlistArgs = {
  developerId: Scalars['ID']['input'];
};


export type MutationCreateDeveloperProfileArgs = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};


export type MutationCreateRecruiterProfileArgs = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};


export type MutationDeleteExperienceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFromShortlistArgs = {
  developerId: Scalars['ID']['input'];
};


export type MutationUpdateDeveloperProfileArgs = {
  input: UpdateDeveloperInput;
};


export type MutationUpdateExperienceArgs = {
  input: UpdateExperienceInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


export type MutationUpdateRecruiterProfileArgs = {
  input: UpdateRecruiterInput;
};


export type MutationUploadIntroVideoArgs = {
  file: Scalars['CustomUpload']['input'];
};


export type MutationUploadProfilePhotoArgs = {
  file: Scalars['CustomUpload']['input'];
};

export type PagingInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type Profile = Developer | Recruiter;

/** Project */
export type Project = {
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  techStack: Array<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  /** Get a single developer by ID */
  getDeveloper?: Maybe<Developer>;
  /** Get all developers with pagination and filtering */
  getDevelopers: DeveloperConnection;
  /** Get current user developer profile */
  getMyDeveloperProfile?: Maybe<Developer>;
  /** Get current user recruiter profile */
  getMyRecruiterProfile?: Maybe<Recruiter>;
  /** Get current user shortlist */
  getMyShortlist: Array<Shortlist>;
  /** Get shortlist count */
  getMyShortlistCount: Scalars['Int']['output'];
  /** Check if developer is in shortlist */
  isInMyShortlist: Scalars['Boolean']['output'];
  user: UserQuery;
};


export type QueryGetDeveloperArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetDevelopersArgs = {
  filter?: InputMaybe<DeveloperFilterInput>;
  paging?: InputMaybe<PagingInput>;
  sort?: InputMaybe<DeveloperSortInput>;
};


export type QueryIsInMyShortlistArgs = {
  developerId: Scalars['ID']['input'];
};

/** Recruiter */
export type Recruiter = {
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
};

/** Developer seniority/experience level */
export type SeniorityLevel =
  /** 0-2 years of experience */
  | 'Junior'
  /** 8-12 years of experience */
  | 'Lead'
  /** 2-4 years of experience */
  | 'Mid'
  /** 12+ years of experience */
  | 'Principal'
  /** 4-8 years of experience */
  | 'Senior';

/** Shortlist entry */
export type Shortlist = {
  createdAt: Scalars['DateTime']['output'];
  developer: Developer;
  id: Scalars['ID']['output'];
};

/** Sort */
export type Sort =
  | 'ASC'
  | 'DESC';

export type UpdateDeveloperInput = {
  availabilityStatus?: InputMaybe<AvailabilityStatus>;
  bio?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  githubUrl?: InputMaybe<Scalars['String']['input']>;
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  linkedinUrl?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  onboardingCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  personalSiteUrl?: InputMaybe<Scalars['String']['input']>;
  seniorityLevel?: InputMaybe<SeniorityLevel>;
  techStack?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateExperienceInput = {
  companyName?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endYear?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  position?: InputMaybe<Scalars['String']['input']>;
  startYear?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  techStack?: InputMaybe<Array<Scalars['String']['input']>>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRecruiterInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  id: Scalars['ID']['input'];
  status: UserStatus;
};

export type UpdateUserRoleInput = {
  id: Scalars['ID']['input'];
  role: UserRole;
};

/** User */
export type User = {
  authProvider: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  profile?: Maybe<Profile>;
  role: UserRole;
  status: UserStatus;
};

export type UserFilterInput = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export type UserMutation = {
  /** Change own password */
  changePassword: User;
  /** Delete user (Admin only) */
  delete: DeleteResult;
  /** Delete self */
  deleteMe: DeleteResult;
  /** Update user status (Admin only) */
  update: User;
  /** Update user role (Admin only) */
  updateRole: User;
};


export type UserMutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type UserMutationDeleteArgs = {
  input: DeleteUserInput;
};


export type UserMutationUpdateArgs = {
  input: UpdateUserInput;
};


export type UserMutationUpdateRoleArgs = {
  input: UpdateUserRoleInput;
};

/** User paging result */
export type UserPagingResult = {
  limit?: Maybe<Scalars['Float']['output']>;
  page?: Maybe<Scalars['Float']['output']>;
  results: Array<User>;
  total?: Maybe<Scalars['Float']['output']>;
};

export type UserQuery = {
  /** Get current user */
  getMe: User;
  /** Get user by id (Admin only) */
  getUser: User;
  /** Get users with filtering, sorting and paging (Admin only) */
  getUsers: UserPagingResult;
};


export type UserQueryGetUserArgs = {
  input: GetUserInput;
};


export type UserQueryGetUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  paging?: InputMaybe<PagingInput>;
  sort?: InputMaybe<UserSortInput>;
};

/** User role */
export type UserRole =
  | 'Admin'
  | 'Developer'
  | 'Recruiter';

export type UserSortInput = {
  email?: InputMaybe<Sort>;
  id?: InputMaybe<Sort>;
  name?: InputMaybe<Sort>;
  role?: InputMaybe<Sort>;
  status?: InputMaybe<Sort>;
};

/** User status */
export type UserStatus =
  | 'Active'
  | 'Inactive'
  | 'Suspended';

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { user: { getMe: { id: string, email: string, role: UserRole, status: UserStatus, authProvider: string, createdAt: string, profile?:
        | { id: string, firstName: string, lastName: string, createdAt: string, jobTitle?: string | null, bio?: string | null, location?: string | null, seniorityLevel?: SeniorityLevel | null, availabilityStatus?: AvailabilityStatus | null, techStack: Array<string>, githubUrl?: string | null, linkedinUrl?: string | null, personalSiteUrl?: string | null, onboardingCompleted: boolean, profilePhoto?: { id: string, url: string, type: MediaType } | null, introVideo?: { id: string, url: string, type: MediaType, processingStatus?: MediaProcessingStatus | null } | null, introVideoThumbnail?: { id: string, url: string, type: MediaType } | null, experiences: Array<{ id: string, companyName: string, position: string, startYear: number, endYear?: number | null, description?: string | null }>, projects: Array<{ id: string, name: string, description?: string | null, url?: string | null, techStack: Array<string> }> }
        | { id: string, email: string, firstName: string, lastName: string, createdAt: string }
       | null } } };

export type GetMyDeveloperProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyDeveloperProfileQuery = { getMyDeveloperProfile?: { id: string, firstName: string, lastName: string, createdAt: string, jobTitle?: string | null, bio?: string | null, location?: string | null, seniorityLevel?: SeniorityLevel | null, availabilityStatus?: AvailabilityStatus | null, techStack: Array<string>, githubUrl?: string | null, linkedinUrl?: string | null, personalSiteUrl?: string | null, onboardingCompleted: boolean, profilePhoto?: { id: string, url: string, type: MediaType } | null, introVideo?: { id: string, url: string, type: MediaType, processingStatus?: MediaProcessingStatus | null } | null, introVideoThumbnail?: { id: string, url: string, type: MediaType } | null, experiences: Array<{ id: string, companyName: string, position: string, startYear: number, endYear?: number | null, description?: string | null }>, projects: Array<{ id: string, name: string, description?: string | null, url?: string | null, techStack: Array<string> }> } | null };

export type GetDeveloperQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDeveloperQuery = { getDeveloper?: { id: string, firstName: string, lastName: string, jobTitle?: string | null, bio?: string | null, location?: string | null, seniorityLevel?: SeniorityLevel | null, availabilityStatus?: AvailabilityStatus | null, techStack: Array<string>, githubUrl?: string | null, linkedinUrl?: string | null, personalSiteUrl?: string | null, profilePhoto?: { id: string, url: string, type: MediaType } | null, introVideo?: { id: string, url: string, type: MediaType, processingStatus?: MediaProcessingStatus | null } | null, introVideoThumbnail?: { id: string, url: string, type: MediaType } | null, experiences: Array<{ id: string, companyName: string, position: string, startYear: number, endYear?: number | null, description?: string | null }>, projects: Array<{ id: string, name: string, description?: string | null, url?: string | null, techStack: Array<string> }> } | null };

export type GetDevelopersQueryVariables = Exact<{
  filter?: InputMaybe<DeveloperFilterInput>;
  paging?: InputMaybe<PagingInput>;
  sort?: InputMaybe<DeveloperSortInput>;
}>;


export type GetDevelopersQuery = { getDevelopers: { total: number, page?: number | null, limit?: number | null, results: Array<{ id: string, firstName: string, lastName: string, jobTitle?: string | null, bio?: string | null, location?: string | null, seniorityLevel?: SeniorityLevel | null, availabilityStatus?: AvailabilityStatus | null, techStack: Array<string>, githubUrl?: string | null, linkedinUrl?: string | null, profilePhoto?: { id: string, url: string, type: MediaType } | null }> } };

export type GetMyRecruiterProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyRecruiterProfileQuery = { getMyRecruiterProfile?: { id: string, email: string, firstName: string, lastName: string, createdAt: string } | null };

export type CreateDeveloperProfileMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
}>;


export type CreateDeveloperProfileMutation = { createDeveloperProfile: { id: string, firstName: string, lastName: string } };

export type UpdateDeveloperProfileMutationVariables = Exact<{
  input: UpdateDeveloperInput;
}>;


export type UpdateDeveloperProfileMutation = { updateDeveloperProfile: { id: string, firstName: string, lastName: string, jobTitle?: string | null, bio?: string | null, location?: string | null, seniorityLevel?: SeniorityLevel | null, availabilityStatus?: AvailabilityStatus | null, techStack: Array<string>, githubUrl?: string | null, linkedinUrl?: string | null, personalSiteUrl?: string | null, onboardingCompleted: boolean } };

export type DeleteAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAccountMutation = { user: { deleteMe: { affected?: number | null } } };

export type CreateRecruiterProfileMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
}>;


export type CreateRecruiterProfileMutation = { createRecruiterProfile: { id: string, email: string, firstName: string, lastName: string } };

export type UpdateRecruiterProfileMutationVariables = Exact<{
  input: UpdateRecruiterInput;
}>;


export type UpdateRecruiterProfileMutation = { updateRecruiterProfile: { id: string, email: string, firstName: string, lastName: string } };

export type AddExperienceMutationVariables = Exact<{
  input: CreateExperienceInput;
}>;


export type AddExperienceMutation = { addExperience: { id: string, companyName: string, position: string, startYear: number, endYear?: number | null, description?: string | null } };

export type UpdateExperienceMutationVariables = Exact<{
  input: UpdateExperienceInput;
}>;


export type UpdateExperienceMutation = { updateExperience: { id: string, companyName: string, position: string, startYear: number, endYear?: number | null, description?: string | null } };

export type DeleteExperienceMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteExperienceMutation = { deleteExperience: boolean };

export type AddProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type AddProjectMutation = { addProject: { id: string, name: string, description?: string | null, url?: string | null, techStack: Array<string> } };

export type UpdateProjectMutationVariables = Exact<{
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { updateProject: { id: string, name: string, description?: string | null, url?: string | null, techStack: Array<string> } };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProjectMutation = { deleteProject: boolean };

export type UploadProfilePhotoMutationVariables = Exact<{
  file: Scalars['CustomUpload']['input'];
}>;


export type UploadProfilePhotoMutation = { uploadProfilePhoto: { id: string, url: string, type: MediaType } };

export type DeleteProfilePhotoMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteProfilePhotoMutation = { deleteProfilePhoto: boolean };

export type UploadIntroVideoMutationVariables = Exact<{
  file: Scalars['CustomUpload']['input'];
}>;


export type UploadIntroVideoMutation = { uploadIntroVideo: boolean };

export type DeleteIntroVideoMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteIntroVideoMutation = { deleteIntroVideo: boolean };

export type GetMyShortlistQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyShortlistQuery = { getMyShortlist: Array<{ id: string, createdAt: string, developer: { id: string, firstName: string, lastName: string, jobTitle?: string | null, location?: string | null, seniorityLevel?: SeniorityLevel | null, techStack: Array<string>, bio?: string | null, githubUrl?: string | null, linkedinUrl?: string | null, profilePhoto?: { id: string, url: string } | null } }> };

export type GetMyShortlistCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyShortlistCountQuery = { getMyShortlistCount: number };

export type IsInMyShortlistQueryVariables = Exact<{
  developerId: Scalars['ID']['input'];
}>;


export type IsInMyShortlistQuery = { isInMyShortlist: boolean };

export type AddToShortlistMutationVariables = Exact<{
  developerId: Scalars['ID']['input'];
}>;


export type AddToShortlistMutation = { addToShortlist: { id: string, createdAt: string, developer: { id: string, firstName: string, lastName: string } } };

export type RemoveFromShortlistMutationVariables = Exact<{
  developerId: Scalars['ID']['input'];
}>;


export type RemoveFromShortlistMutation = { removeFromShortlist: boolean };

export type ClearMyShortlistMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearMyShortlistMutation = { clearMyShortlist: boolean };


export const GetMeDocument = gql`
    query GetMe {
  user {
    getMe {
      id
      email
      role
      status
      authProvider
      createdAt
      profile {
        ... on Developer {
          id
          firstName
          lastName
          createdAt
          jobTitle
          bio
          location
          seniorityLevel
          availabilityStatus
          techStack
          githubUrl
          linkedinUrl
          personalSiteUrl
          onboardingCompleted
          profilePhoto {
            id
            url
            type
          }
          introVideo {
            id
            url
            type
            processingStatus
          }
          introVideoThumbnail {
            id
            url
            type
          }
          experiences {
            id
            companyName
            position
            startYear
            endYear
            description
          }
          projects {
            id
            name
            description
            url
            techStack
          }
        }
        ... on Recruiter {
          id
          email
          firstName
          lastName
          createdAt
        }
      }
    }
  }
}
    `;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
      }
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
// @ts-ignore
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>): Apollo.UseSuspenseQueryResult<GetMeQuery, GetMeQueryVariables>;
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>): Apollo.UseSuspenseQueryResult<GetMeQuery | undefined, GetMeQueryVariables>;
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeSuspenseQueryHookResult = ReturnType<typeof useGetMeSuspenseQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;
export const GetMyDeveloperProfileDocument = gql`
    query GetMyDeveloperProfile {
  getMyDeveloperProfile {
    id
    firstName
    lastName
    createdAt
    jobTitle
    bio
    location
    seniorityLevel
    availabilityStatus
    techStack
    githubUrl
    linkedinUrl
    personalSiteUrl
    onboardingCompleted
    profilePhoto {
      id
      url
      type
    }
    introVideo {
      id
      url
      type
      processingStatus
    }
    introVideoThumbnail {
      id
      url
      type
    }
    experiences {
      id
      companyName
      position
      startYear
      endYear
      description
    }
    projects {
      id
      name
      description
      url
      techStack
    }
  }
}
    `;

/**
 * __useGetMyDeveloperProfileQuery__
 *
 * To run a query within a React component, call `useGetMyDeveloperProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyDeveloperProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyDeveloperProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyDeveloperProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>(GetMyDeveloperProfileDocument, options);
      }
export function useGetMyDeveloperProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>(GetMyDeveloperProfileDocument, options);
        }
// @ts-ignore
export function useGetMyDeveloperProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>;
export function useGetMyDeveloperProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyDeveloperProfileQuery | undefined, GetMyDeveloperProfileQueryVariables>;
export function useGetMyDeveloperProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>(GetMyDeveloperProfileDocument, options);
        }
export type GetMyDeveloperProfileQueryHookResult = ReturnType<typeof useGetMyDeveloperProfileQuery>;
export type GetMyDeveloperProfileLazyQueryHookResult = ReturnType<typeof useGetMyDeveloperProfileLazyQuery>;
export type GetMyDeveloperProfileSuspenseQueryHookResult = ReturnType<typeof useGetMyDeveloperProfileSuspenseQuery>;
export type GetMyDeveloperProfileQueryResult = Apollo.QueryResult<GetMyDeveloperProfileQuery, GetMyDeveloperProfileQueryVariables>;
export const GetDeveloperDocument = gql`
    query GetDeveloper($id: ID!) {
  getDeveloper(id: $id) {
    id
    firstName
    lastName
    jobTitle
    bio
    location
    seniorityLevel
    availabilityStatus
    techStack
    githubUrl
    linkedinUrl
    personalSiteUrl
    profilePhoto {
      id
      url
      type
    }
    introVideo {
      id
      url
      type
      processingStatus
    }
    introVideoThumbnail {
      id
      url
      type
    }
    experiences {
      id
      companyName
      position
      startYear
      endYear
      description
    }
    projects {
      id
      name
      description
      url
      techStack
    }
  }
}
    `;

/**
 * __useGetDeveloperQuery__
 *
 * To run a query within a React component, call `useGetDeveloperQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeveloperQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeveloperQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDeveloperQuery(baseOptions: Apollo.QueryHookOptions<GetDeveloperQuery, GetDeveloperQueryVariables> & ({ variables: GetDeveloperQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeveloperQuery, GetDeveloperQueryVariables>(GetDeveloperDocument, options);
      }
export function useGetDeveloperLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeveloperQuery, GetDeveloperQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeveloperQuery, GetDeveloperQueryVariables>(GetDeveloperDocument, options);
        }
// @ts-ignore
export function useGetDeveloperSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeveloperQuery, GetDeveloperQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeveloperQuery, GetDeveloperQueryVariables>;
export function useGetDeveloperSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeveloperQuery, GetDeveloperQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeveloperQuery | undefined, GetDeveloperQueryVariables>;
export function useGetDeveloperSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeveloperQuery, GetDeveloperQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeveloperQuery, GetDeveloperQueryVariables>(GetDeveloperDocument, options);
        }
export type GetDeveloperQueryHookResult = ReturnType<typeof useGetDeveloperQuery>;
export type GetDeveloperLazyQueryHookResult = ReturnType<typeof useGetDeveloperLazyQuery>;
export type GetDeveloperSuspenseQueryHookResult = ReturnType<typeof useGetDeveloperSuspenseQuery>;
export type GetDeveloperQueryResult = Apollo.QueryResult<GetDeveloperQuery, GetDeveloperQueryVariables>;
export const GetDevelopersDocument = gql`
    query GetDevelopers($filter: DeveloperFilterInput, $paging: PagingInput, $sort: DeveloperSortInput) {
  getDevelopers(filter: $filter, paging: $paging, sort: $sort) {
    total
    page
    limit
    results {
      id
      firstName
      lastName
      jobTitle
      bio
      location
      seniorityLevel
      availabilityStatus
      techStack
      githubUrl
      linkedinUrl
      profilePhoto {
        id
        url
        type
      }
    }
  }
}
    `;

/**
 * __useGetDevelopersQuery__
 *
 * To run a query within a React component, call `useGetDevelopersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDevelopersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDevelopersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      paging: // value for 'paging'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useGetDevelopersQuery(baseOptions?: Apollo.QueryHookOptions<GetDevelopersQuery, GetDevelopersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDevelopersQuery, GetDevelopersQueryVariables>(GetDevelopersDocument, options);
      }
export function useGetDevelopersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDevelopersQuery, GetDevelopersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDevelopersQuery, GetDevelopersQueryVariables>(GetDevelopersDocument, options);
        }
// @ts-ignore
export function useGetDevelopersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDevelopersQuery, GetDevelopersQueryVariables>): Apollo.UseSuspenseQueryResult<GetDevelopersQuery, GetDevelopersQueryVariables>;
export function useGetDevelopersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDevelopersQuery, GetDevelopersQueryVariables>): Apollo.UseSuspenseQueryResult<GetDevelopersQuery | undefined, GetDevelopersQueryVariables>;
export function useGetDevelopersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDevelopersQuery, GetDevelopersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDevelopersQuery, GetDevelopersQueryVariables>(GetDevelopersDocument, options);
        }
export type GetDevelopersQueryHookResult = ReturnType<typeof useGetDevelopersQuery>;
export type GetDevelopersLazyQueryHookResult = ReturnType<typeof useGetDevelopersLazyQuery>;
export type GetDevelopersSuspenseQueryHookResult = ReturnType<typeof useGetDevelopersSuspenseQuery>;
export type GetDevelopersQueryResult = Apollo.QueryResult<GetDevelopersQuery, GetDevelopersQueryVariables>;
export const GetMyRecruiterProfileDocument = gql`
    query GetMyRecruiterProfile {
  getMyRecruiterProfile {
    id
    email
    firstName
    lastName
    createdAt
  }
}
    `;

/**
 * __useGetMyRecruiterProfileQuery__
 *
 * To run a query within a React component, call `useGetMyRecruiterProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyRecruiterProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyRecruiterProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyRecruiterProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>(GetMyRecruiterProfileDocument, options);
      }
export function useGetMyRecruiterProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>(GetMyRecruiterProfileDocument, options);
        }
// @ts-ignore
export function useGetMyRecruiterProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>;
export function useGetMyRecruiterProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyRecruiterProfileQuery | undefined, GetMyRecruiterProfileQueryVariables>;
export function useGetMyRecruiterProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>(GetMyRecruiterProfileDocument, options);
        }
export type GetMyRecruiterProfileQueryHookResult = ReturnType<typeof useGetMyRecruiterProfileQuery>;
export type GetMyRecruiterProfileLazyQueryHookResult = ReturnType<typeof useGetMyRecruiterProfileLazyQuery>;
export type GetMyRecruiterProfileSuspenseQueryHookResult = ReturnType<typeof useGetMyRecruiterProfileSuspenseQuery>;
export type GetMyRecruiterProfileQueryResult = Apollo.QueryResult<GetMyRecruiterProfileQuery, GetMyRecruiterProfileQueryVariables>;
export const CreateDeveloperProfileDocument = gql`
    mutation CreateDeveloperProfile($firstName: String!, $lastName: String!) {
  createDeveloperProfile(firstName: $firstName, lastName: $lastName) {
    id
    firstName
    lastName
  }
}
    `;
export type CreateDeveloperProfileMutationFn = Apollo.MutationFunction<CreateDeveloperProfileMutation, CreateDeveloperProfileMutationVariables>;

/**
 * __useCreateDeveloperProfileMutation__
 *
 * To run a mutation, you first call `useCreateDeveloperProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDeveloperProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDeveloperProfileMutation, { data, loading, error }] = useCreateDeveloperProfileMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *   },
 * });
 */
export function useCreateDeveloperProfileMutation(baseOptions?: Apollo.MutationHookOptions<CreateDeveloperProfileMutation, CreateDeveloperProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDeveloperProfileMutation, CreateDeveloperProfileMutationVariables>(CreateDeveloperProfileDocument, options);
      }
export type CreateDeveloperProfileMutationHookResult = ReturnType<typeof useCreateDeveloperProfileMutation>;
export type CreateDeveloperProfileMutationResult = Apollo.MutationResult<CreateDeveloperProfileMutation>;
export type CreateDeveloperProfileMutationOptions = Apollo.BaseMutationOptions<CreateDeveloperProfileMutation, CreateDeveloperProfileMutationVariables>;
export const UpdateDeveloperProfileDocument = gql`
    mutation UpdateDeveloperProfile($input: UpdateDeveloperInput!) {
  updateDeveloperProfile(input: $input) {
    id
    firstName
    lastName
    jobTitle
    bio
    location
    seniorityLevel
    availabilityStatus
    techStack
    githubUrl
    linkedinUrl
    personalSiteUrl
    onboardingCompleted
  }
}
    `;
export type UpdateDeveloperProfileMutationFn = Apollo.MutationFunction<UpdateDeveloperProfileMutation, UpdateDeveloperProfileMutationVariables>;

/**
 * __useUpdateDeveloperProfileMutation__
 *
 * To run a mutation, you first call `useUpdateDeveloperProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDeveloperProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDeveloperProfileMutation, { data, loading, error }] = useUpdateDeveloperProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDeveloperProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDeveloperProfileMutation, UpdateDeveloperProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDeveloperProfileMutation, UpdateDeveloperProfileMutationVariables>(UpdateDeveloperProfileDocument, options);
      }
export type UpdateDeveloperProfileMutationHookResult = ReturnType<typeof useUpdateDeveloperProfileMutation>;
export type UpdateDeveloperProfileMutationResult = Apollo.MutationResult<UpdateDeveloperProfileMutation>;
export type UpdateDeveloperProfileMutationOptions = Apollo.BaseMutationOptions<UpdateDeveloperProfileMutation, UpdateDeveloperProfileMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount {
  user {
    deleteMe {
      affected
    }
  }
}
    `;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const CreateRecruiterProfileDocument = gql`
    mutation CreateRecruiterProfile($firstName: String!, $lastName: String!) {
  createRecruiterProfile(firstName: $firstName, lastName: $lastName) {
    id
    email
    firstName
    lastName
  }
}
    `;
export type CreateRecruiterProfileMutationFn = Apollo.MutationFunction<CreateRecruiterProfileMutation, CreateRecruiterProfileMutationVariables>;

/**
 * __useCreateRecruiterProfileMutation__
 *
 * To run a mutation, you first call `useCreateRecruiterProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRecruiterProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRecruiterProfileMutation, { data, loading, error }] = useCreateRecruiterProfileMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *   },
 * });
 */
export function useCreateRecruiterProfileMutation(baseOptions?: Apollo.MutationHookOptions<CreateRecruiterProfileMutation, CreateRecruiterProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRecruiterProfileMutation, CreateRecruiterProfileMutationVariables>(CreateRecruiterProfileDocument, options);
      }
export type CreateRecruiterProfileMutationHookResult = ReturnType<typeof useCreateRecruiterProfileMutation>;
export type CreateRecruiterProfileMutationResult = Apollo.MutationResult<CreateRecruiterProfileMutation>;
export type CreateRecruiterProfileMutationOptions = Apollo.BaseMutationOptions<CreateRecruiterProfileMutation, CreateRecruiterProfileMutationVariables>;
export const UpdateRecruiterProfileDocument = gql`
    mutation UpdateRecruiterProfile($input: UpdateRecruiterInput!) {
  updateRecruiterProfile(input: $input) {
    id
    email
    firstName
    lastName
  }
}
    `;
export type UpdateRecruiterProfileMutationFn = Apollo.MutationFunction<UpdateRecruiterProfileMutation, UpdateRecruiterProfileMutationVariables>;

/**
 * __useUpdateRecruiterProfileMutation__
 *
 * To run a mutation, you first call `useUpdateRecruiterProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRecruiterProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRecruiterProfileMutation, { data, loading, error }] = useUpdateRecruiterProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRecruiterProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRecruiterProfileMutation, UpdateRecruiterProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRecruiterProfileMutation, UpdateRecruiterProfileMutationVariables>(UpdateRecruiterProfileDocument, options);
      }
export type UpdateRecruiterProfileMutationHookResult = ReturnType<typeof useUpdateRecruiterProfileMutation>;
export type UpdateRecruiterProfileMutationResult = Apollo.MutationResult<UpdateRecruiterProfileMutation>;
export type UpdateRecruiterProfileMutationOptions = Apollo.BaseMutationOptions<UpdateRecruiterProfileMutation, UpdateRecruiterProfileMutationVariables>;
export const AddExperienceDocument = gql`
    mutation AddExperience($input: CreateExperienceInput!) {
  addExperience(input: $input) {
    id
    companyName
    position
    startYear
    endYear
    description
  }
}
    `;
export type AddExperienceMutationFn = Apollo.MutationFunction<AddExperienceMutation, AddExperienceMutationVariables>;

/**
 * __useAddExperienceMutation__
 *
 * To run a mutation, you first call `useAddExperienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddExperienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addExperienceMutation, { data, loading, error }] = useAddExperienceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddExperienceMutation(baseOptions?: Apollo.MutationHookOptions<AddExperienceMutation, AddExperienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddExperienceMutation, AddExperienceMutationVariables>(AddExperienceDocument, options);
      }
export type AddExperienceMutationHookResult = ReturnType<typeof useAddExperienceMutation>;
export type AddExperienceMutationResult = Apollo.MutationResult<AddExperienceMutation>;
export type AddExperienceMutationOptions = Apollo.BaseMutationOptions<AddExperienceMutation, AddExperienceMutationVariables>;
export const UpdateExperienceDocument = gql`
    mutation UpdateExperience($input: UpdateExperienceInput!) {
  updateExperience(input: $input) {
    id
    companyName
    position
    startYear
    endYear
    description
  }
}
    `;
export type UpdateExperienceMutationFn = Apollo.MutationFunction<UpdateExperienceMutation, UpdateExperienceMutationVariables>;

/**
 * __useUpdateExperienceMutation__
 *
 * To run a mutation, you first call `useUpdateExperienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExperienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExperienceMutation, { data, loading, error }] = useUpdateExperienceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateExperienceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExperienceMutation, UpdateExperienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExperienceMutation, UpdateExperienceMutationVariables>(UpdateExperienceDocument, options);
      }
export type UpdateExperienceMutationHookResult = ReturnType<typeof useUpdateExperienceMutation>;
export type UpdateExperienceMutationResult = Apollo.MutationResult<UpdateExperienceMutation>;
export type UpdateExperienceMutationOptions = Apollo.BaseMutationOptions<UpdateExperienceMutation, UpdateExperienceMutationVariables>;
export const DeleteExperienceDocument = gql`
    mutation DeleteExperience($id: ID!) {
  deleteExperience(id: $id)
}
    `;
export type DeleteExperienceMutationFn = Apollo.MutationFunction<DeleteExperienceMutation, DeleteExperienceMutationVariables>;

/**
 * __useDeleteExperienceMutation__
 *
 * To run a mutation, you first call `useDeleteExperienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExperienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExperienceMutation, { data, loading, error }] = useDeleteExperienceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExperienceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExperienceMutation, DeleteExperienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExperienceMutation, DeleteExperienceMutationVariables>(DeleteExperienceDocument, options);
      }
export type DeleteExperienceMutationHookResult = ReturnType<typeof useDeleteExperienceMutation>;
export type DeleteExperienceMutationResult = Apollo.MutationResult<DeleteExperienceMutation>;
export type DeleteExperienceMutationOptions = Apollo.BaseMutationOptions<DeleteExperienceMutation, DeleteExperienceMutationVariables>;
export const AddProjectDocument = gql`
    mutation AddProject($input: CreateProjectInput!) {
  addProject(input: $input) {
    id
    name
    description
    url
    techStack
  }
}
    `;
export type AddProjectMutationFn = Apollo.MutationFunction<AddProjectMutation, AddProjectMutationVariables>;

/**
 * __useAddProjectMutation__
 *
 * To run a mutation, you first call `useAddProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addProjectMutation, { data, loading, error }] = useAddProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddProjectMutation(baseOptions?: Apollo.MutationHookOptions<AddProjectMutation, AddProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddProjectMutation, AddProjectMutationVariables>(AddProjectDocument, options);
      }
export type AddProjectMutationHookResult = ReturnType<typeof useAddProjectMutation>;
export type AddProjectMutationResult = Apollo.MutationResult<AddProjectMutation>;
export type AddProjectMutationOptions = Apollo.BaseMutationOptions<AddProjectMutation, AddProjectMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($input: UpdateProjectInput!) {
  updateProject(input: $input) {
    id
    name
    description
    url
    techStack
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: ID!) {
  deleteProject(id: $id)
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const UploadProfilePhotoDocument = gql`
    mutation UploadProfilePhoto($file: CustomUpload!) {
  uploadProfilePhoto(file: $file) {
    id
    url
    type
  }
}
    `;
export type UploadProfilePhotoMutationFn = Apollo.MutationFunction<UploadProfilePhotoMutation, UploadProfilePhotoMutationVariables>;

/**
 * __useUploadProfilePhotoMutation__
 *
 * To run a mutation, you first call `useUploadProfilePhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadProfilePhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadProfilePhotoMutation, { data, loading, error }] = useUploadProfilePhotoMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadProfilePhotoMutation(baseOptions?: Apollo.MutationHookOptions<UploadProfilePhotoMutation, UploadProfilePhotoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadProfilePhotoMutation, UploadProfilePhotoMutationVariables>(UploadProfilePhotoDocument, options);
      }
export type UploadProfilePhotoMutationHookResult = ReturnType<typeof useUploadProfilePhotoMutation>;
export type UploadProfilePhotoMutationResult = Apollo.MutationResult<UploadProfilePhotoMutation>;
export type UploadProfilePhotoMutationOptions = Apollo.BaseMutationOptions<UploadProfilePhotoMutation, UploadProfilePhotoMutationVariables>;
export const DeleteProfilePhotoDocument = gql`
    mutation DeleteProfilePhoto {
  deleteProfilePhoto
}
    `;
export type DeleteProfilePhotoMutationFn = Apollo.MutationFunction<DeleteProfilePhotoMutation, DeleteProfilePhotoMutationVariables>;

/**
 * __useDeleteProfilePhotoMutation__
 *
 * To run a mutation, you first call `useDeleteProfilePhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProfilePhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProfilePhotoMutation, { data, loading, error }] = useDeleteProfilePhotoMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteProfilePhotoMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProfilePhotoMutation, DeleteProfilePhotoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProfilePhotoMutation, DeleteProfilePhotoMutationVariables>(DeleteProfilePhotoDocument, options);
      }
export type DeleteProfilePhotoMutationHookResult = ReturnType<typeof useDeleteProfilePhotoMutation>;
export type DeleteProfilePhotoMutationResult = Apollo.MutationResult<DeleteProfilePhotoMutation>;
export type DeleteProfilePhotoMutationOptions = Apollo.BaseMutationOptions<DeleteProfilePhotoMutation, DeleteProfilePhotoMutationVariables>;
export const UploadIntroVideoDocument = gql`
    mutation UploadIntroVideo($file: CustomUpload!) {
  uploadIntroVideo(file: $file)
}
    `;
export type UploadIntroVideoMutationFn = Apollo.MutationFunction<UploadIntroVideoMutation, UploadIntroVideoMutationVariables>;

/**
 * __useUploadIntroVideoMutation__
 *
 * To run a mutation, you first call `useUploadIntroVideoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadIntroVideoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadIntroVideoMutation, { data, loading, error }] = useUploadIntroVideoMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadIntroVideoMutation(baseOptions?: Apollo.MutationHookOptions<UploadIntroVideoMutation, UploadIntroVideoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadIntroVideoMutation, UploadIntroVideoMutationVariables>(UploadIntroVideoDocument, options);
      }
export type UploadIntroVideoMutationHookResult = ReturnType<typeof useUploadIntroVideoMutation>;
export type UploadIntroVideoMutationResult = Apollo.MutationResult<UploadIntroVideoMutation>;
export type UploadIntroVideoMutationOptions = Apollo.BaseMutationOptions<UploadIntroVideoMutation, UploadIntroVideoMutationVariables>;
export const DeleteIntroVideoDocument = gql`
    mutation DeleteIntroVideo {
  deleteIntroVideo
}
    `;
export type DeleteIntroVideoMutationFn = Apollo.MutationFunction<DeleteIntroVideoMutation, DeleteIntroVideoMutationVariables>;

/**
 * __useDeleteIntroVideoMutation__
 *
 * To run a mutation, you first call `useDeleteIntroVideoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteIntroVideoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteIntroVideoMutation, { data, loading, error }] = useDeleteIntroVideoMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteIntroVideoMutation(baseOptions?: Apollo.MutationHookOptions<DeleteIntroVideoMutation, DeleteIntroVideoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteIntroVideoMutation, DeleteIntroVideoMutationVariables>(DeleteIntroVideoDocument, options);
      }
export type DeleteIntroVideoMutationHookResult = ReturnType<typeof useDeleteIntroVideoMutation>;
export type DeleteIntroVideoMutationResult = Apollo.MutationResult<DeleteIntroVideoMutation>;
export type DeleteIntroVideoMutationOptions = Apollo.BaseMutationOptions<DeleteIntroVideoMutation, DeleteIntroVideoMutationVariables>;
export const GetMyShortlistDocument = gql`
    query GetMyShortlist {
  getMyShortlist {
    id
    createdAt
    developer {
      id
      firstName
      lastName
      jobTitle
      location
      seniorityLevel
      techStack
      bio
      githubUrl
      linkedinUrl
      profilePhoto {
        id
        url
      }
    }
  }
}
    `;

/**
 * __useGetMyShortlistQuery__
 *
 * To run a query within a React component, call `useGetMyShortlistQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyShortlistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyShortlistQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyShortlistQuery(baseOptions?: Apollo.QueryHookOptions<GetMyShortlistQuery, GetMyShortlistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyShortlistQuery, GetMyShortlistQueryVariables>(GetMyShortlistDocument, options);
      }
export function useGetMyShortlistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyShortlistQuery, GetMyShortlistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyShortlistQuery, GetMyShortlistQueryVariables>(GetMyShortlistDocument, options);
        }
// @ts-ignore
export function useGetMyShortlistSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyShortlistQuery, GetMyShortlistQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyShortlistQuery, GetMyShortlistQueryVariables>;
export function useGetMyShortlistSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyShortlistQuery, GetMyShortlistQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyShortlistQuery | undefined, GetMyShortlistQueryVariables>;
export function useGetMyShortlistSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyShortlistQuery, GetMyShortlistQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyShortlistQuery, GetMyShortlistQueryVariables>(GetMyShortlistDocument, options);
        }
export type GetMyShortlistQueryHookResult = ReturnType<typeof useGetMyShortlistQuery>;
export type GetMyShortlistLazyQueryHookResult = ReturnType<typeof useGetMyShortlistLazyQuery>;
export type GetMyShortlistSuspenseQueryHookResult = ReturnType<typeof useGetMyShortlistSuspenseQuery>;
export type GetMyShortlistQueryResult = Apollo.QueryResult<GetMyShortlistQuery, GetMyShortlistQueryVariables>;
export const GetMyShortlistCountDocument = gql`
    query GetMyShortlistCount {
  getMyShortlistCount
}
    `;

/**
 * __useGetMyShortlistCountQuery__
 *
 * To run a query within a React component, call `useGetMyShortlistCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyShortlistCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyShortlistCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyShortlistCountQuery(baseOptions?: Apollo.QueryHookOptions<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>(GetMyShortlistCountDocument, options);
      }
export function useGetMyShortlistCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>(GetMyShortlistCountDocument, options);
        }
// @ts-ignore
export function useGetMyShortlistCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>;
export function useGetMyShortlistCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>): Apollo.UseSuspenseQueryResult<GetMyShortlistCountQuery | undefined, GetMyShortlistCountQueryVariables>;
export function useGetMyShortlistCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>(GetMyShortlistCountDocument, options);
        }
export type GetMyShortlistCountQueryHookResult = ReturnType<typeof useGetMyShortlistCountQuery>;
export type GetMyShortlistCountLazyQueryHookResult = ReturnType<typeof useGetMyShortlistCountLazyQuery>;
export type GetMyShortlistCountSuspenseQueryHookResult = ReturnType<typeof useGetMyShortlistCountSuspenseQuery>;
export type GetMyShortlistCountQueryResult = Apollo.QueryResult<GetMyShortlistCountQuery, GetMyShortlistCountQueryVariables>;
export const IsInMyShortlistDocument = gql`
    query IsInMyShortlist($developerId: ID!) {
  isInMyShortlist(developerId: $developerId)
}
    `;

/**
 * __useIsInMyShortlistQuery__
 *
 * To run a query within a React component, call `useIsInMyShortlistQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsInMyShortlistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsInMyShortlistQuery({
 *   variables: {
 *      developerId: // value for 'developerId'
 *   },
 * });
 */
export function useIsInMyShortlistQuery(baseOptions: Apollo.QueryHookOptions<IsInMyShortlistQuery, IsInMyShortlistQueryVariables> & ({ variables: IsInMyShortlistQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsInMyShortlistQuery, IsInMyShortlistQueryVariables>(IsInMyShortlistDocument, options);
      }
export function useIsInMyShortlistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsInMyShortlistQuery, IsInMyShortlistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsInMyShortlistQuery, IsInMyShortlistQueryVariables>(IsInMyShortlistDocument, options);
        }
// @ts-ignore
export function useIsInMyShortlistSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<IsInMyShortlistQuery, IsInMyShortlistQueryVariables>): Apollo.UseSuspenseQueryResult<IsInMyShortlistQuery, IsInMyShortlistQueryVariables>;
export function useIsInMyShortlistSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IsInMyShortlistQuery, IsInMyShortlistQueryVariables>): Apollo.UseSuspenseQueryResult<IsInMyShortlistQuery | undefined, IsInMyShortlistQueryVariables>;
export function useIsInMyShortlistSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IsInMyShortlistQuery, IsInMyShortlistQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IsInMyShortlistQuery, IsInMyShortlistQueryVariables>(IsInMyShortlistDocument, options);
        }
export type IsInMyShortlistQueryHookResult = ReturnType<typeof useIsInMyShortlistQuery>;
export type IsInMyShortlistLazyQueryHookResult = ReturnType<typeof useIsInMyShortlistLazyQuery>;
export type IsInMyShortlistSuspenseQueryHookResult = ReturnType<typeof useIsInMyShortlistSuspenseQuery>;
export type IsInMyShortlistQueryResult = Apollo.QueryResult<IsInMyShortlistQuery, IsInMyShortlistQueryVariables>;
export const AddToShortlistDocument = gql`
    mutation AddToShortlist($developerId: ID!) {
  addToShortlist(developerId: $developerId) {
    id
    createdAt
    developer {
      id
      firstName
      lastName
    }
  }
}
    `;
export type AddToShortlistMutationFn = Apollo.MutationFunction<AddToShortlistMutation, AddToShortlistMutationVariables>;

/**
 * __useAddToShortlistMutation__
 *
 * To run a mutation, you first call `useAddToShortlistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToShortlistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToShortlistMutation, { data, loading, error }] = useAddToShortlistMutation({
 *   variables: {
 *      developerId: // value for 'developerId'
 *   },
 * });
 */
export function useAddToShortlistMutation(baseOptions?: Apollo.MutationHookOptions<AddToShortlistMutation, AddToShortlistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddToShortlistMutation, AddToShortlistMutationVariables>(AddToShortlistDocument, options);
      }
export type AddToShortlistMutationHookResult = ReturnType<typeof useAddToShortlistMutation>;
export type AddToShortlistMutationResult = Apollo.MutationResult<AddToShortlistMutation>;
export type AddToShortlistMutationOptions = Apollo.BaseMutationOptions<AddToShortlistMutation, AddToShortlistMutationVariables>;
export const RemoveFromShortlistDocument = gql`
    mutation RemoveFromShortlist($developerId: ID!) {
  removeFromShortlist(developerId: $developerId)
}
    `;
export type RemoveFromShortlistMutationFn = Apollo.MutationFunction<RemoveFromShortlistMutation, RemoveFromShortlistMutationVariables>;

/**
 * __useRemoveFromShortlistMutation__
 *
 * To run a mutation, you first call `useRemoveFromShortlistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFromShortlistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFromShortlistMutation, { data, loading, error }] = useRemoveFromShortlistMutation({
 *   variables: {
 *      developerId: // value for 'developerId'
 *   },
 * });
 */
export function useRemoveFromShortlistMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFromShortlistMutation, RemoveFromShortlistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFromShortlistMutation, RemoveFromShortlistMutationVariables>(RemoveFromShortlistDocument, options);
      }
export type RemoveFromShortlistMutationHookResult = ReturnType<typeof useRemoveFromShortlistMutation>;
export type RemoveFromShortlistMutationResult = Apollo.MutationResult<RemoveFromShortlistMutation>;
export type RemoveFromShortlistMutationOptions = Apollo.BaseMutationOptions<RemoveFromShortlistMutation, RemoveFromShortlistMutationVariables>;
export const ClearMyShortlistDocument = gql`
    mutation ClearMyShortlist {
  clearMyShortlist
}
    `;
export type ClearMyShortlistMutationFn = Apollo.MutationFunction<ClearMyShortlistMutation, ClearMyShortlistMutationVariables>;

/**
 * __useClearMyShortlistMutation__
 *
 * To run a mutation, you first call `useClearMyShortlistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearMyShortlistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearMyShortlistMutation, { data, loading, error }] = useClearMyShortlistMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearMyShortlistMutation(baseOptions?: Apollo.MutationHookOptions<ClearMyShortlistMutation, ClearMyShortlistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearMyShortlistMutation, ClearMyShortlistMutationVariables>(ClearMyShortlistDocument, options);
      }
export type ClearMyShortlistMutationHookResult = ReturnType<typeof useClearMyShortlistMutation>;
export type ClearMyShortlistMutationResult = Apollo.MutationResult<ClearMyShortlistMutation>;
export type ClearMyShortlistMutationOptions = Apollo.BaseMutationOptions<ClearMyShortlistMutation, ClearMyShortlistMutationVariables>;