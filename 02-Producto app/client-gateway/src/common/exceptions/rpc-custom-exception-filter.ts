/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
//import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { ErrorInterface } from '../interfaces/errorInterface';
//import { number } from 'joi';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError() as ErrorInterface;

    //console.log(rpcError);

    if (isNaN(rpcError.status)) rpcError.status = 400;

    response.status(rpcError.status).json(rpcError);
  }
}
