/* eslint-disable prettier/prettier */
import { getApiCacheKey } from '@libs/cache';
import {
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
  CACHE_TTL_METADATA,
} from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  HttpServer,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const HTTP_ADAPTER_HOST = 'HttpAdapterHost';
const REFLECTOR = 'Reflector';

export interface HttpAdapterHost<T extends HttpServer = any> {
  httpAdapter: T;
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  @Optional()
  @Inject(HTTP_ADAPTER_HOST)
  protected readonly httpAdapterHost: HttpAdapterHost;

  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: any,
    @Inject(REFLECTOR) protected readonly reflector: any,
  ) { }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    const ttlValueOrFactory =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ?? null;

    if (!key) {
      return next.handle();
    }
    try {
      const value = await this.cacheManager.get(key);
      if (value !== undefined && value !== null) {
        return of(value);
      }
      const ttl =
        typeof ttlValueOrFactory === 'function'
          ? await ttlValueOrFactory(context)
          : ttlValueOrFactory;
      return next.handle().pipe(
        tap(async (response) => {
          const args = (ttl === undefined || ttl === null) ?
            [key, response, { ttl: 60 }] : [key, response, { ttl }];

          try {
            await this.cacheManager.set(...args);
          } catch (err) {
            console.error(
              `An error has occured when inserting "key: ${key}", "value: ${response}"`,
              'CacheInterceptor',
              err,
            );
          }
        }),
      );
    } catch {
      return next.handle();
    }
  }

  protected trackBy(context: ExecutionContext): string | undefined {
    const cacheMetadata = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    const originalUrl = context.switchToHttp().getRequest().originalUrl;
    const cacheKey = getApiCacheKey(cacheMetadata, originalUrl);
    return cacheKey;
  }
}
