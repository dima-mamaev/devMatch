import { gql } from "@apollo/client";

// ==================== USER QUERIES ====================

export const GET_ME = gql`
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

// ==================== DEVELOPER QUERIES ====================

export const GET_MY_DEVELOPER_PROFILE = gql`
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

export const GET_DEVELOPER = gql`
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

export const GET_DEVELOPERS = gql`
  query GetDevelopers(
    $filter: DeveloperFilterInput
    $paging: PagingInput
    $sort: DeveloperSortInput
  ) {
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
        introVideo {
          id
          url
        }
        introVideoThumbnail {
          id
          url
        }
      }
    }
  }
`;

// ==================== RECRUITER QUERIES ====================

export const GET_MY_RECRUITER_PROFILE = gql`
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

// ==================== DEVELOPER MUTATIONS ====================

export const CREATE_DEVELOPER_PROFILE = gql`
  mutation CreateDeveloperProfile($firstName: String!, $lastName: String!) {
    createDeveloperProfile(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

export const UPDATE_DEVELOPER_PROFILE = gql`
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

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount {
    user {
      deleteMe {
        affected
      }
    }
  }
`;

// ==================== RECRUITER MUTATIONS ====================

export const CREATE_RECRUITER_PROFILE = gql`
  mutation CreateRecruiterProfile($firstName: String!, $lastName: String!) {
    createRecruiterProfile(firstName: $firstName, lastName: $lastName) {
      id
      email
      firstName
      lastName
    }
  }
`;

export const UPDATE_RECRUITER_PROFILE = gql`
  mutation UpdateRecruiterProfile($input: UpdateRecruiterInput!) {
    updateRecruiterProfile(input: $input) {
      id
      email
      firstName
      lastName
    }
  }
`;

// ==================== EXPERIENCE MUTATIONS ====================

export const ADD_EXPERIENCE = gql`
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

export const UPDATE_EXPERIENCE = gql`
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

export const DELETE_EXPERIENCE = gql`
  mutation DeleteExperience($id: ID!) {
    deleteExperience(id: $id)
  }
`;

// ==================== PROJECT MUTATIONS ====================

export const ADD_PROJECT = gql`
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

export const UPDATE_PROJECT = gql`
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

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

// ==================== MEDIA MUTATIONS ====================

export const UPLOAD_PROFILE_PHOTO = gql`
  mutation UploadProfilePhoto($file: CustomUpload!) {
    uploadProfilePhoto(file: $file) {
      id
      url
      type
    }
  }
`;

export const DELETE_PROFILE_PHOTO = gql`
  mutation DeleteProfilePhoto {
    deleteProfilePhoto
  }
`;

export const UPLOAD_INTRO_VIDEO = gql`
  mutation UploadIntroVideo($file: CustomUpload!) {
    uploadIntroVideo(file: $file)
  }
`;

export const DELETE_INTRO_VIDEO = gql`
  mutation DeleteIntroVideo {
    deleteIntroVideo
  }
`;

// ==================== SHORTLIST QUERIES ====================

export const GET_MY_SHORTLIST = gql`
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

export const GET_MY_SHORTLIST_COUNT = gql`
  query GetMyShortlistCount {
    getMyShortlistCount
  }
`;

export const IS_IN_MY_SHORTLIST = gql`
  query IsInMyShortlist($developerId: ID!) {
    isInMyShortlist(developerId: $developerId)
  }
`;

// ==================== SHORTLIST MUTATIONS ====================

export const ADD_TO_SHORTLIST = gql`
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

export const REMOVE_FROM_SHORTLIST = gql`
  mutation RemoveFromShortlist($developerId: ID!) {
    removeFromShortlist(developerId: $developerId)
  }
`;

export const CLEAR_MY_SHORTLIST = gql`
  mutation ClearMyShortlist {
    clearMyShortlist
  }
`;
