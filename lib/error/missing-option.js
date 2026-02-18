import { BaseError } from './base-error.js';
import { getDashedOption } from '../utils.js';
import * as c from 'colorette';

class MissingOptionError extends BaseError {
  constructor(option, command, program) {
    let msg = `Missing option ${c.italic(getDashedOption(option))}.`;
    super(msg, {option, command}, program);
  }
}

export { MissingOptionError };
