import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CSRFExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const isCsrfError =
            exception.code === 'EBADCSRFTOKEN' ||
            exception.message?.toLowerCase().includes('csrf');

        if (isCsrfError) {
            return response.status(HttpStatus.FORBIDDEN).json({
                statusCode: 403,
                message: 'Invalid or missing CSRF token',
                error: 'Forbidden',
            });
        }

        // If it's a standard Nest error (like ForbiddenException), let it pass through
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const resBody = exception.getResponse();
            return response.status(status).json(resBody);
        }

        // Otherwise, throw it so Nest can handle it as a 500 or through other filters
        throw exception;
    }
}