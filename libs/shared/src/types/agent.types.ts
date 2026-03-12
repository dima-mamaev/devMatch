export interface AgentMatchResult {
  developerId: string;
  matchScore: number;
  matchReason: string;
}

export interface AgentResponse {
  response: {
    matches: AgentMatchResult[];
    searchSummary: string;
    totalCandidates: number;
  };
  threadId: string;
}

export interface DeveloperSearchParams {
  techStack?: string[];
  seniorityLevels?: string[];
  location?: string;
  availabilityStatus?: string[];
  searchText?: string;
  excludeIds?: string[];
  limit?: number;
}

export interface DeveloperProfile {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  bio?: string;
  techStack: string[];
  seniorityLevel?: string;
  location?: string;
  availabilityStatus?: string;
  profilePhotoUrl?: string;
  experiences: {
    companyName: string;
    position: string;
    yearsWorked: number;
  }[];
  projects: {
    name: string;
    techStack: string[];
  }[];
}
