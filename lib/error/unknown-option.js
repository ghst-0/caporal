import { BaseError } from './base-error.js';
import { getSuggestions, getBoldDiffString } from '../suggest.js';
import { getDashedOption } from '../utils.js';
import * as c from 'colorette';

class UnknownOptionError extends BaseError {
  constructor(option, command, program) {
    const suggestions = getSuggestions(option, command._getLongOptions());
    let msg = `Unknown option ${c.italic(getDashedOption(option))}.`;
    if (suggestions.length) {
      msg += ' Did you mean ' + suggestions.map(
        s => '--' + getBoldDiffString(option, s)
      ).join(' or maybe ') + ' ?';
    }
    super(msg, {option, command}, program);
  }
}

export { UnknownOptionError };
