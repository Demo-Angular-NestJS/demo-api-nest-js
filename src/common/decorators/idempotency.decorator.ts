import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENCY_REQUIRED_KEY = 'idempotency_required';
export const RequireIdempotency = () => SetMetadata(IDEMPOTENCY_REQUIRED_KEY, true);