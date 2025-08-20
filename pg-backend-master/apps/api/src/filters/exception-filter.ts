import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (status === 500) {
      const errorInfoObj = {
        url: request.url,
        method: request.method,
        body: JSON.stringify(request.body, null, 2),
        error: JSON.stringify(exception, null, 2),
      };
      console.log(exception);
      this.logger.error(
        'API unhandled error',
        JSON.stringify(errorInfoObj, null, 2),
      );
      return response.status(status).json({
        statusCode: status,
      });
    }

    const errObj = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      body: request.body,
      url: request.url,
      error: (exception as any).response.message,
    };
    this.logger.debug('Http error', errObj);

    response.status(status).json({
      statusCode: status,
      message: (exception as any).response.message,
      error: (exception as any).message,
    });
  }
}
