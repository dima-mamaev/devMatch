import { registerEnumType } from '@nestjs/graphql';

export enum AvailabilityStatus {
  Available = 'Available',
  OpenToOffers = 'OpenToOffers',
  NotAvailable = 'NotAvailable',
}

registerEnumType(AvailabilityStatus, {
  name: 'AvailabilityStatus',
  description: 'Developer availability status',
});
