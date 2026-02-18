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
    private readonly LOCK_TTL = 30;

    constructor(@Inject(CACHE_MANAGER) private cacheManager: cacheManager.Cache) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        if (!['POST', 'PATCH', 'PUT'].includes(request.method) || request.url.includes('/search')) {
            return next.handle();
        }

        const idempotencyKey = request.headers['idempotency-key'];

        if (!idempotencyKey) {
            throw new BadRequestException('Idempotency-Key header is required');
        }

        const cacheKey = `lock:${idempotencyKey}`;
        const isProcessing = await this.cacheManager.get(cacheKey);

        if (isProcessing) {
            throw new ConflictException('Another request with this key is currently in progress');
        }

        await this.cacheManager.set(cacheKey, true, this.LOCK_TTL);

        return next.handle().pipe(
            tap({
                next: () => this.cacheManager.del(cacheKey),
                error: () => this.cacheManager.del(cacheKey),
            })
        );
    }
}