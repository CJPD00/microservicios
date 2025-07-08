/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-base-to-string */
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

    if (rpcError.toString().includes('Empty Response')) {
      return response.status(500).json({
        status: 500,
        message: rpcError
          .toString()
          .substring(0, rpcError.toString().indexOf('(') - 1),
      });
    }

    //console.log(rpcError);

    if (isNaN(rpcError.status)) rpcError.status = 400;

    response.status(rpcError.status).json(rpcError);
  }
}
