import type { AssistantTool } from 'openai/resources/beta/assistants';

export const TOOL_DEFINITIONS: AssistantTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_by_role',
      description:
        'Search for developers by role (e.g., "devops", "backend", "frontend"). Automatically searches by relevant technologies AND job titles. This is the preferred search method for role-based queries.',
      parameters: {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            enum: ['devops', 'backend', 'frontend', 'fullstack', 'mobile', 'data', 'qa'],
            description: 'The developer role to search for',
          },
          seniorityLevels: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['junior', 'mid', 'senior', 'lead', 'principal'],
            },
            description: 'Seniority levels to include (optional)',
          },
          location: {
            type: 'string',
            description: 'Location filter (optional)',
          },
          availabilityStatus: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['Available', 'OpenToOffers', 'NotAvailable'],
            },
            description: 'Filter by availability status (optional)',
          },
          excludeIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'Developer IDs to exclude from results',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results (default: 3, max: 10)',
          },
        },
        required: ['role'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_developers',
      description:
        'Search for developers by specific technologies. Use search_by_role for role-based queries (devops, backend, etc.). Use this for specific tech requirements.',
      parameters: {
        type: 'object',
        properties: {
          techStack: {
            type: 'array',
            items: { type: 'string' },
            description:
              "Technologies to filter by (e.g., ['React', 'Node.js', 'TypeScript']). Use get_available_tech_stack first to see exact names.",
          },
          seniorityLevels: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['junior', 'mid', 'senior', 'lead', 'principal'],
            },
            description: 'Seniority levels to include',
          },
          location: {
            type: 'string',
            description:
              "Location filter (supports partial match, e.g., 'San Francisco' or 'Remote')",
          },
          availabilityStatus: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['Available', 'OpenToOffers', 'NotAvailable'],
            },
            description: 'Filter by availability status',
          },
          searchText: {
            type: 'string',
            description: 'ONLY use for searching by developer NAME. Do NOT use for domain/project type filtering (e.g., "SaaS", "marketplace") - those should be used for scoring matches, not filtering.',
          },
          excludeIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'Developer IDs to exclude from results',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results (default: 3, max: 10)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_developer_details',
      description:
        'Get full profile details for a specific developer including all experiences and projects.',
      parameters: {
        type: 'object',
        properties: {
          developerId: {
            type: 'string',
            description: 'The UUID of the developer to retrieve',
          },
        },
        required: ['developerId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_available_tech_stack',
      description:
        'Get a list of all unique technologies in the database. Useful for understanding what skills are available.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_developer_statistics',
      description:
        'Get statistics about developers in the database (counts by seniority, location, etc.)',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];
