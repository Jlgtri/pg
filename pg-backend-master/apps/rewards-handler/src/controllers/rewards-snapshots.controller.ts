import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventName } from '../constants';
import { RewardsSnapshotsService } from '../services';

@Controller()
export class RewardsSnapshotsController {
  @Inject() private rewardsSnapshotsService: RewardsSnapshotsService;

  @MessagePattern(EventName.CheckIn)
  async checkIn(wallet: string) {
    try {
      const response = await this.rewardsSnapshotsService.checkIn(wallet);
      return response;
    } catch (error) {
      return { error: (error as Error).stack, success: false };
    }
  }
}
