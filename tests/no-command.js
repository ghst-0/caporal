import sinon from 'sinon';
import should from 'should';

import { Program } from '../lib/program.js';
import { logger } from './utils/callback-logger.js';
import { makeArgv } from './utils/make-argv.js';


describe('Setting up no command() but an action()', () => {

  const program = new Program();

  program
    .logger(logger)
    .version('1.0.0');

  it(`should execute action()`, () => {
    const action = sinon.stub();
    program.action(action);
    program.parse([]);
    should(action.callCount).eql(1);
  });
});

describe('Setting up no command() but an argument() and an action()', () => {

  const program = new Program();

  program
    .logger(logger)
    .version('1.0.0')
    .argument('<foo>', 'My foo arg');

  it(`should execute action()`, () => {
    const action = sinon.stub();
    program.action(action);
    program.parse(makeArgv(['myarg']));
    should(action.callCount).eql(1);
  });
});


