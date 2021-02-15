import {Context, Next} from "koa";
import {
    ErrorType,
    HttpText,
    HttpCode,
    MongoErrorType,
    MongoErrorCode
} from "../types/errorHandler";

export default class ErrorHandler {
    static async handle(ctx: Context, next: Next): Promise<void> {
        await next().catch(error => {
            if (error.name === ErrorType.mongoError) {
                return ErrorHandler.handleMongoExceptions(error, ctx);
            }
            ErrorHandler.handleEverythingElse(error, ctx);
        });
    }

    private static buildErrorMessage(error: Error, ctx: Context) {
        const status: number = ctx.status || HttpCode.internalServerError;
        const errorMessage: string = error.message || HttpText.internalServerError;

        return `[${error.name}]:[${status} - ${errorMessage}]`;
    }

    private static handleMongoExceptions(error: MongoErrorType, ctx: Context) {
        const {message, code, keyValue} = error;
        switch (code) {
            case MongoErrorCode.duplicateKey:
                // eslint-disable-next-line no-case-declarations
                const [key, value] = Object.entries(keyValue).shift();
                ctx.status = HttpCode.badRequest;
                ctx.body = `Value "${value}" for "${key}" field is already taken`;
                break;
            default:
                ctx.status = HttpCode.badRequest;
                ctx.body = message;
        }

        ctx.app.emit('error', `[${ErrorType.mongoError}]:[${HttpCode.badRequest} - ${message}]`);
    }

    private static handleEverythingElse(error: Error, ctx: Context) {

        switch (error.name) {
            case ErrorType.validationError:
                ctx.status = HttpCode.badRequest;
                ctx.body = error.message;
                break;
            case ErrorType.typeError:
            case ErrorType.castError:
                // ctx.status = HttpCode.badRequest;
                // ctx.body = HttpText.badRequest;
                ctx.throw(HttpCode.badRequest, HttpText.badRequest);
                break;
            default:
                ctx.status = HttpCode.internalServerError;
                ctx.body = HttpText.internalServerError;
        }

        ctx.app.emit('error', ErrorHandler.buildErrorMessage(error, ctx));
    }
}
