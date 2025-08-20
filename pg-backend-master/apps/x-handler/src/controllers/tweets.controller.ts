import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventName } from '../constants';
import { TweetsService } from '../services';

@Controller()
export class TweetsController {
  @Inject() private tweetsService: TweetsService;

  @MessagePattern(EventName.Tweets.findAndMarkExisting)
  async findTweetAndMarkAsExisting(wallet: string) {
    try {
      const response = await this.tweetsService.findTweetAndMarkAsExisting(
        wallet,
      );
      return { success: true, data: response };
    } catch (error) {
      return { error: (error as Error).stack, success: false };
    }
  }
}
