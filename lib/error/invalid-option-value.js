import { BaseError } from './base-error.js';
import { getDashedOption } from '../utils.js';
import * as c from 'colorette';

class InvalidOptionValueError extends BaseError {
  constructor(option, value, command, originalError, program) {
    const displayedValue = typeof value === "boolean" && value === true ? '(empty)' : `'${value}'`
    const originalMessage = originalError.meta.error ? originalError.meta.error.message : ""
    let msg = `Invalid value ${displayedValue} for option ${c.italic(getDashedOption(option))}. ${originalMessage}`;
    super(msg, {option, command, originalError}, program);
  }
}

export { InvalidOptionValueError };
