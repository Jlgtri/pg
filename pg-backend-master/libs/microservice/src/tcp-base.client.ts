import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  TcpOptions,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MicroserviceResponse } from './microservice.types';
import { Logger } from '@nestjs/common';

export class TcpBaseClient {
  protected client: ClientProxy;
  private logger = new Logger(TcpBaseClient.name);
  private tcpOptions: TcpOptions['options'];

  constructor(tcpConfig: TcpOptions['options']) {
    this.client = ClientProxyFactory.create({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      transport: Transport.TCP,
      options: tcpConfig,
    });
    this.tcpOptions = tcpConfig;
  }

  protected async sendAndHandleResponse<T = any>(
    type: string,
    data: any,
  ): Promise<MicroserviceResponse<T>> {
    try {
      const response = await firstValueFrom<MicroserviceResponse<T>>(
        this.client.send(type, data),
      );
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.log(error);
      this.logger.error(
        `Error sending request to ${this.tcpOptions?.host}:${this.tcpOptions?.port}`,
        error as Error,
      );
      return {
        error: (error as Error).stack,
        success: false,
      };
    }
  }
}
