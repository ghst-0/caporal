import { describe, it, mock } from 'node:test';
import { equal } from 'node:assert/strict';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

describe('Setting up no command() but an action()', () => {

  const program = new Program();

  program
    .version('1.0.0');

  it(`should execute action()`, () => {
    const action = mock.fn();
    program.action(action);
    program.parse([]);
    equal(action.mock.callCount(), 1);
  });
});

describe('Setting up no command() but an argument() and an action()', () => {

  const program = new Program();

  program
    .version('1.0.0')
    .argument('<foo>', 'My foo arg');

  it(`should execute action()`, () => {
    const action = mock.fn();
    program.action(action);
    program.parse(makeArgv(['myarg']));
    equal(action.mock.callCount(), 1);
  });
});
