import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    private readonly logger = new Logger(AllExceptionsFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const response = context.getResponse()
        const request = context.getRequest()

        let status
        let message

        if(exception instanceof HttpException) {
            status = exception.getStatus()
            message = exception.getResponse()
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR
            message = exception
        }

        this.logger.error(`HTTP Status: ${status} | Error Message: ${JSON.stringify(message)}`)

        response.status(status).json({
            timestamp: new Date().toISOString(),
            path: request.url,
            error: message
        })
    }

}