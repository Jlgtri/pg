import { toLower } from '@libs/utils';
import { COMMON_API_CACHE_KEY } from './cache.constants';

export const applyColons = (...keys: (string | number)[]): string =>
  keys.map((k) => (typeof k === 'string' ? toLower(k) : k)).join(':');

export const getApiCacheKey = (
  targetCachKey: string,
  requestUrl?: string,
): string => {
  const path = [COMMON_API_CACHE_KEY, targetCachKey];
  const originalQuery = requestUrl?.split('?')[1];
  if (originalQuery) {
    path.push(originalQuery);
  } else {
    path.push('_');
  }
  return applyColons(...path);
};

export const getApiCacheKeyByKey = (
  targetCachKey: string,
  key: string,
): string => {
  const path = [COMMON_API_CACHE_KEY, targetCachKey, key];
  return applyColons(...path);
};

export const getAllApiCacheKey = (targetCachKey: string): string => {
  const path = [COMMON_API_CACHE_KEY, targetCachKey];
  return applyColons(...path, '*');
};
