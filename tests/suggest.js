import { describe, it } from 'node:test';
import { equal } from 'node:assert/strict';
import sinon from 'sinon';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

import { stripColor } from './utils/strip-color.js';

const program = new Program();

program
  .version('1.0.0');


describe('Passing --foo', () => {

  it(`should suggest --foor and --afoo and --footx`, () => {
    program
      .option('--foor <foor>')
      .option('--afoo <afoo>')
      .option('--footx <footx>')
      .action(function() {});

    const error = sinon.stub(program, "fatalError", function(err) {
      equal(err.name, 'UnknownOptionError');
      equal(stripColor(err.originalMessage).includes('foor'), true);
      equal(stripColor(err.originalMessage).includes('afoo'), true);
      equal(stripColor(err.originalMessage).includes('footx'), true);
    });
    program.parse(makeArgv('--foo'));
    equal(error.callCount, 1);
    error.restore();
    program.reset();
  });
});
