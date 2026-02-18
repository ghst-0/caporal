import { describe, it } from 'node:test';
import { equal } from 'node:assert/strict';
import sinon from 'sinon';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

describe('Setting up no command() but an action()', () => {

  const program = new Program();

  program
    .version('1.0.0');

  it(`should execute action()`, () => {
    const action = sinon.stub();
    program.action(action);
    program.parse([]);
    equal(action.callCount, 1);
  });
});

describe('Setting up no command() but an argument() and an action()', () => {

  const program = new Program();

  program
    .version('1.0.0')
    .argument('<foo>', 'My foo arg');

  it(`should execute action()`, () => {
    const action = sinon.stub();
    program.action(action);
    program.parse(makeArgv(['myarg']));
    equal(action.callCount, 1);
  });
});
