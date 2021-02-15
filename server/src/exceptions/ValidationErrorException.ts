import {ExceptionType} from '../types/errorHandler';
import {ValidationErrorItem} from 'joi';

export default class ValidationErrorException extends Error {
  public details: ValidationErrorItem[];

  constructor(details: ValidationErrorItem[]) {
    super('Validation error');
    this.name = ExceptionType.validationErrorException;
    this.details = details;
  }
}