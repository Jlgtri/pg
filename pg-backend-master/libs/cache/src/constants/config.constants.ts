import CONFIG from 'config';

export const RedisConfig = {
  config: {
    host: CONFIG.REDIS.HOST,
    port: CONFIG.REDIS.PORT,
    password: CONFIG.REDIS.PASSWORD,
    username: CONFIG.REDIS.USERNAME,
  },
};
