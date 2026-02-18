import { describe, it, mock } from 'node:test';
import { equal } from 'node:assert/strict';
import * as c from 'colorette';

import { Program } from '../../lib/program.js';
import { makeArgv } from '../utils/make-argv.js';

const program = new Program();

program
  .version('1.0.0')
  .command('issue118', 'Fix!');

describe('Issue #118 - Unknown option --undefined', () => {
  it('should return shortname in error text whenever longname is not provided', () => {

    program.fatalError = mock.fn((err) => {
      equal(err.name, 'MissingOptionError');
      equal(err.originalMessage, `Missing option ${c.italic('-z')}.`);
    })

    program.option('-z <whatever>', 'Random option', program.INT, null, true);
    program.parse(makeArgv([]));

  });
});
