import { registerEnumType } from '@nestjs/graphql';

export enum SeniorityLevel {
  Junior = 'junior',
  Mid = 'mid',
  Senior = 'senior',
  Lead = 'lead',
  Principal = 'principal',
}

registerEnumType(SeniorityLevel, {
  name: 'SeniorityLevel',
  description: 'Developer seniority/experience level',
  valuesMap: {
    Junior: { description: '0-2 years of experience' },
    Mid: { description: '2-4 years of experience' },
    Senior: { description: '4-8 years of experience' },
    Lead: { description: '8-12 years of experience' },
    Principal: { description: '12+ years of experience' },
  },
});
