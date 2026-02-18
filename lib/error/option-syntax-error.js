import { BaseError } from './base-error.js';

class OptionSyntaxError extends BaseError {
  constructor(synopsis, program) {
    let msg = `Syntax error in option synopsis: ${synopsis}`;
    super(msg, {synopsis}, program);
  }
}

export { OptionSyntaxError };
