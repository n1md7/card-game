import { Context, Next } from 'koa';
import { ErrorType, HttpText, HttpCode, MongoErrorType, MongoErrorCode, ExceptionType } from '../types/error';
import { ValidationErrorItem } from 'joi';
import { KoaEvent } from '../types';

class ErrorHandler {
  static async handle(ctx: Context, next: Next): Promise<void> {
    await next().catch((error) => {
      if (error.name === ErrorType.mongoError) {
        return ErrorHandler.handleMongoExceptions(error, ctx);
      }
      ErrorHandler.handleEverythingElse(error, ctx);
    });
  }

  private static buildErrorMessage(error: Error & { details?: ValidationErrorItem }, ctx: Context) {
    const status: number = ctx.status || HttpCode.internalServerError;
    const errorMessage: string = error.message || error.details?.toString() || HttpText.internalServerError;

    return `[${error.name}]:[${status} - ${errorMessage}]`;
  }

  private static handleMongoExceptions(error: MongoErrorType, ctx: Context) {
    const { message, code, keyValue } = error;
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

    ctx.app.emit(KoaEvent.serverError, `[${ErrorType.mongoError}]:[${HttpCode.badRequest} - ${message}]`);
  }

  private static handleEverythingElse(error: Error & { details?: ValidationErrorItem }, ctx: Context) {
    switch (error.name) {
      case ExceptionType.validationErrorException:
        ctx.status = HttpCode.badRequest;
        ctx.body = error.details.message;
        break;
      case ErrorType.jsonWebTokenError:
      case ErrorType.tokenExpiredError:
        ctx.status = HttpCode.unauthorized;
        ctx.body = error.message;
        break;
      case ErrorType.error:
      case ErrorType.validationError:
        ctx.status = HttpCode.badRequest;
        ctx.body = error.message;
        break;
      case ErrorType.typeError:
      case ErrorType.castError:
        ctx.status = HttpCode.badRequest;
        ctx.body = HttpText.badRequest;
        break;
      default:
        ctx.status = HttpCode.internalServerError;
        ctx.body = HttpText.internalServerError;
    }

    ctx.app.emit(KoaEvent.serverError, ErrorHandler.buildErrorMessage(error, ctx));
  }
}

export default ErrorHandler.handle;
