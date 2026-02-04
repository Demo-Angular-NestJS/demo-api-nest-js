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
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { createHash } from 'crypto';
import { IDEMPOTENCY_REQUIRED_KEY } from 'common/decorators';

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

        // Check if the specific route requires idempotency via @RequireIdempotency()
        const isRequired = this.reflector.getAllAndOverride<boolean>(IDEMPOTENCY_REQUIRED_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 2. Conditional enforcement
        if (!idempotencyKey) {
            if (isRequired) {
                throw new BadRequestException('Idempotency-Key header is required for this operation');
            }
            return next.handle(); // Not required and not provided, just proceed
        }

        // 3. Create hash of the body (Safety check)
        const bodyHash = createHash('sha256')
            .update(JSON.stringify(request.body ?? {}))
            .digest('hex');

        const cacheKey = `idempotency:${idempotencyKey}:${bodyHash}`;

        // 4. Cache Lookup
        const cachedRecord = await this.cacheManager.get(cacheKey);

        if (cachedRecord) {
            if (cachedRecord === 'PROCESSING') {
                throw new ConflictException('Request with this key is already being processed');
            }
            return of(cachedRecord);
        }

        // 5. Set Lock
        await this.cacheManager.set(cacheKey, 'PROCESSING', 30000);

        return next.handle().pipe(
            tap(async (response) => {
                await this.cacheManager.set(cacheKey, response, 86400000);
            }),
            catchError(async (err) => {
                await this.cacheManager.del(cacheKey);
                return throwError(() => err);
            }),
        );
    }
}