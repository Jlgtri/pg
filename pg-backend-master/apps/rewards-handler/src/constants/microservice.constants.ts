import CONFIG from 'config';
import { TcpOptions, Transport } from '@nestjs/microservices';

export const TCP_CONFIG: TcpOptions = {
  transport: Transport.TCP,
  options: {
    port: CONFIG.SERVICE_SOCKETS.REWARDS_HANDLER.PORT,
    host: CONFIG.SERVICE_SOCKETS.REWARDS_HANDLER.HOST,
  },
};

export const EventName = {
  CheckIn: 'check-in',
};
