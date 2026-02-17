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
import { Reflector } from '@nestjs/core';
import * as cacheManager from 'cache-manager';
import { Observable, from, of, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    // Standardize TTLs (adjust if your cache-manager version uses seconds)
    private readonly LOCK_TTL = 30000; // 30 seconds for "PROCESSING"
    private readonly RESULT_TTL = 86400000; // 24 hours for final result

    constructor(@Inject(CACHE_MANAGER) private cacheManager: cacheManager.Cache) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        if (!['POST', 'PATCH', 'PUT'].includes(request.method)) {
            return next.handle();
        }

        const idempotencyKey = request.headers['idempotency-key'];

        if (!idempotencyKey) {
            throw new BadRequestException('Idempotency-Key header is required');
        }

        // We use the key directly because the Angular side already hashed the body into it.
        const cacheKey = `idempotency:${idempotencyKey}`;

        const cachedRecord = await this.cacheManager.get(cacheKey);

        if (cachedRecord) {
            if (cachedRecord === 'PROCESSING') {
                // This prevents the "same time" race condition you mentioned
                throw new ConflictException('Request is already being processed');
            }
            return of(cachedRecord);
        }

        // Set the Lock
        await this.cacheManager.set(cacheKey, 'PROCESSING', this.LOCK_TTL);

        return next.handle().pipe(
            switchMap(async (response) => {
                // Save the result and return it
                await this.cacheManager.set(cacheKey, response, this.RESULT_TTL);
                return response;
            }),
            catchError((err) => {
                // If the actual logic fails, remove the lock so the user can try again
                return from(this.cacheManager.del(cacheKey)).pipe(
                    switchMap(() => throwError(() => err))
                );
            })
        );
    }
}