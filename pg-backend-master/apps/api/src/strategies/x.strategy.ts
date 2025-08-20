/* eslint-disable prettier/prettier */
import CONFIG from 'config';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { X_CALLBACK_ENDPOINT } from '../constants';
import { DataSource } from 'typeorm';
import { UserEntity } from '@libs/db';
import { XOauthUserProfile } from '../types/x-oauth.types';
import { X_OAUTH, X_API_OAUTH_TOKEN } from '@libs/constants';

// @Injectable()
// export class XStrategy extends PassportStrategy(Strategy, 'x') {
  // @Inject() private dataSource: DataSource;

  // constructor() {
  //   super({
  //     authorizationURL: X_OAUTH,
  //     tokenURL: X_API_OAUTH_TOKEN,
  //     clientID: CONFIG.X_CREDENTIALS.CLIENT_ID,
  //     clientSecret: CONFIG.X_CREDENTIALS.CLIENT_SECRET,
  //     callbackURL: CONFIG.API_DOMEN + 'auth/' + X_CALLBACK_ENDPOINT,
  //     scope: ['tweet.read', 'users.read'],
  //     state: true,
  //     pkce: true,
  //   });
  //   this._oauth2.setAuthMethod('Bearer');
  //   this._oauth2.useAuthorizationHeaderforGET(true);
  // }

  // async userProfile(accessToken: string, done: VerifyCallback) {
  //   try {
  //     await this._oauth2.get(
  //       'https://api.twitter.com/2/users/me',
  //       accessToken,
  //       (err: { statusCode: number; data?: any }, result?: string | Buffer) => {
  //         console.log(result, 'userProfile');
  //         const json = JSON.parse(result as unknown as string);
  //         done(null, json.data);
  //       },
  //     );
  //   } catch (err) {
  //     done(err);
  //   }
  // }

  // async validate(
  //   _accessToken: string,
  //   _refreshToken: string,
  //   profile: XOauthUserProfile,
  //   done: VerifyCallback,
  // ) {
  //   console.log(profile, 'profile');
  //   const { id, name, username } = profile;
  //   const xUser = {
  //     xId: id,
  //     xName: name,
  //     xUserName: username,
  //   };
  //   const existsUser = await this.dataSource.manager.findOneBy(
  //     UserEntity,
  //     xUser,
  //   );
  //   if (existsUser) {
  //     done(null, existsUser);
  //     return existsUser;
  //   }
  //   const savedUser = await this.dataSource.manager.save(UserEntity, xUser);
  //   done(null, savedUser);
  //   return savedUser;
  // }
// }
