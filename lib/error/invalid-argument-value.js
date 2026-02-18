import { BaseError } from './base-error.js';
import * as c from 'colorette';

class InvalidArgumentValueError extends BaseError {

  constructor(arg, value, command, originalError, program) {
    let msg = `Invalid value '${value}' for argument ${c.italic(arg)}.\n   ${originalError.meta.originalError}`;
    super(msg, {arg, command, value}, program);
  }
}

export { InvalidArgumentValueError };
