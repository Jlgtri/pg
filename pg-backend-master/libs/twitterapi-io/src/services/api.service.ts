import { Logger } from '@nestjs/common';
import axios from 'axios';
import CONFIG from 'config';
import { API_URL_FOLLOW_RELATIONSHIP, API_URL_LAST_TWEETS, API_URL_USER_FOLLOWERS } from '../constants/api.constants';
import { CheckFollowRelationshipResponse, LastTweetsResponse, UserFollowersResponse } from '../types/last-tweets.types';



export class ApiService {
  private logger = new Logger(ApiService.name);

  async getLastTweets(
    userName: string,
    cursor?: string,
  ): Promise<LastTweetsResponse | null> {
    try {
      const response = await axios.get(API_URL_LAST_TWEETS, {
        headers: {
          'X-API-Key': CONFIG.TWITTERAPI_IO.KEY,
          includeReplies: false,
        },
        params: {
          userName,
          ...(cursor ? { cursor } : {}),
        },
      });
      // console.log(response)
      if (response.statusText !== 'OK') {
        throw new Error(`Response error: ${response}`);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      this.logger.error('Error on getLastTweets', { error, userName, cursor });
      return null;
    }
  }

  async getUserFollowers(
    userName: string,
    cursor?: string,
  ): Promise<UserFollowersResponse | null> {
    try {
      const response = await axios.get(API_URL_USER_FOLLOWERS, {
        headers: {
          'X-API-Key': CONFIG.TWITTERAPI_IO.KEY,
        },
        params: {
          userName,
          ...(cursor ? { cursor } : {}),
        },
      });
      // console.log(response)
      if (response.statusText !== 'OK') {
        throw new Error(`Response error: ${response}`);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      this.logger.error('Error on getUserFollowers', { error, userName, cursor });
      return null;
    }
  }

  async checkFollowRelationship(
    sourceUserName: string,
    targetUserName?: string,
  ): Promise<CheckFollowRelationshipResponse | null> {
    try {
      const response = await axios.get(API_URL_FOLLOW_RELATIONSHIP, {
        headers: {
          'X-API-Key': CONFIG.TWITTERAPI_IO.KEY,
        },
        params: {
          source_user_name: sourceUserName,
          target_user_name: targetUserName,
        },
      });
      // console.log(response)
      if (response.statusText !== 'OK') {
        throw new Error(`Response error: ${response}`);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      this.logger.error('Error on checkFollowRelationship', { error, sourceUserName, targetUserName });
      return null;
    }
  }
}
