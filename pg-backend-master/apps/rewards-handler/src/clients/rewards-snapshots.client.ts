import { TcpBaseClient } from '@lib/microservice';
import { EventName, TCP_CONFIG } from '../constants';

export class RewardsSnapshotsClient extends TcpBaseClient {
  constructor() {
    super({ host: TCP_CONFIG.options?.host, port: TCP_CONFIG.options?.port });
  }

  async checkIn(wallet: string) {
    return this.sendAndHandleResponse<boolean>(EventName.CheckIn, wallet);
  }
}
