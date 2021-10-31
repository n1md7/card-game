import { ExceptionType } from '../types/error';
import { ValidationErrorItem } from 'joi';

export default class ValidationErrorException extends Error {
  public details: ValidationErrorItem;

  constructor(details: ValidationErrorItem[]) {
    super('Validation error');
    this.name = ExceptionType.validationErrorException;
    // Take first error stack
    this.details = details[0];
  }
}
