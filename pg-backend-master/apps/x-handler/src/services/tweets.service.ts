import { UserEntity } from '@libs/db';
import { API_CHECK_USERNAME } from '@libs/twitterapi-io/constants/api.constants';
import { ApiService as TwitterApiIoApiService } from '@libs/twitterapi-io/services';
import { Inject, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class TweetsService {
  @Inject() private dataSource: DataSource;
  @Inject() private twitterApiIoApiService: TwitterApiIoApiService;

  private logger = new Logger(TweetsService.name);

  async onApplicationBootstrap() {
    // await this.findTweetAndMarkAsExisting(
    //   '0x6ca298d2983ab03aa1da7679389d955a4efee15c',
    // );
  }

  async findTweetAndMarkAsExisting(wallet: string) {
    try {
      const user = await this.dataSource.manager.findOneBy(UserEntity, {
        walletAddress: wallet,
      });
      if (!user) {
        throw new Error('User not found');
      }
      const resCheckFollow = await this.twitterApiIoApiService.checkFollowRelationship(
        user.xUserName,
        API_CHECK_USERNAME,
      );
      const isFollowing = resCheckFollow?.data.following;
      // let cursor: undefined | string = '';
      // let hasNextPage = true;
      // let hasTweet = false;
      // let followersChecked = 0;
      // while (followersChecked < 1000 && !hasTweet && hasNextPage) {
      //   const resFollowers = await this.twitterApiIoApiService.getUserFollowers(
      //     API_CHECK_USERNAME,
      //     cursor,
      //   );
      //   // console.log(resTweets?.data.tweets, 'resTweets');
      //   if (!resFollowers) {
      //     throw new Error('Error on twitterapi.io');
      //   }
      //   resFollowers.data.followers.forEach((follower) => {
      //     // console.log(tweet.text)
      //     // console.log(tweet.text.includes(X_HASHTAG_PROJECT))
      //     if (follower.userName.toUpperCase() == user.xUserName.toUpperCase()) {
      //       hasTweet = true;
      //       return;
      //     }
      //     followersChecked++;
      //   });
      //   cursor = resFollowers.next_cursor;
      //   hasNextPage = resFollowers.has_next_page;
      // }
      if (isFollowing) {
        await this.dataSource.manager.update(
          UserEntity,
          { id: user.id },
          { existsXTweet: isFollowing },
        );
      }
      return isFollowing;
    } catch (error) {
      console.log(error);
      this.logger.error('Error on findTweetAndMarkAsExisting', { ...error });
      return false;
    }
  }
}
