import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublicAccess';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);