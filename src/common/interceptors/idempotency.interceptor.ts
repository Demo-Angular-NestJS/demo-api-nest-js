import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
    ConflictException,
    Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core'; // Added Reflector
import * as cacheManager from 'cache-manager';
import { from, Observable, of, throwError } from 'rxjs';
import { tap, catchError, mergeMap } from 'rxjs/operators';
import { createHash } from 'crypto';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: cacheManager.Cache,
        private reflector: Reflector,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        // 1. Only apply to mutating methods
        if (!['POST', 'PATCH', 'PUT'].includes(request.method)) {
            return next.handle();
        }

        const idempotencyKey = request.headers['idempotency-key'];

        // IdempotencyKey required
        if (!idempotencyKey) {
            throw new BadRequestException('Idempotency-Key header is required for this operation');
        }

        // Create hash of the body (Safety check)
        const bodyHash = createHash('sha256')
            .update(JSON.stringify(request.body ?? {}))
            .digest('hex');

        const cacheKey = `idempotency:${idempotencyKey}:${bodyHash}`;

        //Cache Lookup
        const cachedRecord = await this.cacheManager.get(cacheKey);

        if (cachedRecord) {
            if (cachedRecord === 'PROCESSING') {
                throw new ConflictException('Request with this key is already being processed');
            }
            return of(cachedRecord);
        }

        //Set Lock
        await this.cacheManager.set(cacheKey, 'PROCESSING', 30000);

        return next.handle().pipe(
            tap(async (response) => {
                // Only cache actual successful responses
                await this.cacheManager.set(cacheKey, response, 86400000);
            }),
            catchError((err) => {
                // We use 'from' to handle the async cache deletion
                // then mergeMap to ensure the original error is thrown
                return from(this.cacheManager.del(cacheKey)).pipe(
                    mergeMap(() => throwError(() => err))
                );
            }),
        );
    }
}