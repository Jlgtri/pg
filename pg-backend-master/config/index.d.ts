declare module 'config' {
  namespace CONFIG {
    export const NODE_ENV: string;
    export const API_DOMEN: string;
    export const RPC_LIST: string[];
    export const CHAIN_ID: number;
    export interface IDbConfig {
      readonly HOST: string;
      readonly USER: string;
      readonly PASSWORD: string;
      readonly PORT: number;
      readonly DB: string;
      readonly SYNC: boolean;
      readonly SSL?: boolean;
    }
    export interface ISocket {
      readonly HOST: string;
      readonly PORT: number;
      readonly PASSWORD: string;
      readonly USERNAME: string;
    }
    export const POSTGRES: IDbConfig;
    export const REDIS: ISocket;
    export const SERVICE_SOCKETS: {
      readonly API: ISocket;
      readonly X_HANDLER: ISocket;
      readonly REWARDS_HANDLER: ISocket;
    };
    export const X_CREDENTIALS: {
      readonly CLIENT_ID: string;
      readonly CLIENT_SECRET: string;
    };
    export const TWITTERAPI_IO: {
      readonly KEY: string;
    };
    export const GOLDRUSH: {
      readonly KEY: string;
    };
    export const MAIN_TOKEN: {
      readonly ADDRESS: string;
      readonly DECIMALS: number;
    };
    export const JWT_ACCESS_SECRET: string;
    export const JWT_REFRESH_SECRET: string;
    export const PROJECT: {
      readonly START_DATE: string;
      readonly END_DATE: string;
    };
    export const TELEGRAM: {
      readonly BOT: {
        readonly NAME: string;
        readonly TOKEN: string;
      };
      readonly CHANNEL_ID: number;
    };
    export const DEBANK_API_KEY: string;
    export const SESSION_SECRET: string;
  }
  export default CONFIG;
}
