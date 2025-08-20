import CONFIG from 'config';
import { TcpOptions, Transport } from '@nestjs/microservices';

export const TCP_CONFIG: TcpOptions = {
  transport: Transport.TCP,
  options: {
    port: CONFIG.SERVICE_SOCKETS.X_HANDLER.PORT,
    host: CONFIG.SERVICE_SOCKETS.X_HANDLER.HOST,
  },
};

export const EventName = {
  Tweets: {
    findAndMarkExisting: 'tweets-find-and-mark-existing',
  },
};
