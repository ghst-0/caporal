import { describe, it, mock } from 'node:test';
import { equal } from 'node:assert/strict';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

describe('Setting up no action()', () => {

  it(`should throw NoActionError`, () => {
    const program = new Program();
    program
      .version('1.0.0')
      .command('foo', 'My foo');
    program.fatalError = mock.fn((err) => {
      equal(err.name, 'NoActionError');
    });
    program.parse(makeArgv('foo'));

    const count = program.fatalError.mock.callCount();
    program.fatalError.mock.restore();
    equal(count, 1);
    program.reset();
  });

});


describe('Setting up a sync action', () => {

  it(`should call this action`, () => {
    const program = new Program();
    const action = mock.fn();

    program
      .version('1.0.0')
      .command('foo', 'My foo')
      .action(action);

    program.parse(makeArgv('foo'));

    equal(action.mock.callCount(), 1);

    program.reset();
  });
});


describe('Setting up a async action', () => {

  it(`should succeed for a resolved promise`, () => {
    const program = new Program();
    const action = mock.fn( () => Promise.resolve('foo'))
    program
      .version('1.0.0')
      .command('foo', 'My foo')
      .action(action);
    program.parse(makeArgv('foo'));

    equal(action.mock.callCount(), 1);
    program.reset();
  });

  it(`should fatalError() for a rejected promise (error string)`, async () => {
    const program = new Program();
    const action = mock.fn(() => Promise.reject('Failed!'));
    program.fatalError = mock.fn()
    program
      .version('1.0.0')
      .command('foo', 'My foo')
      .action(action);

    let caught = false;
    try {
      await program.parse(makeArgv('foo'))
    }
    catch {
      equal(action.mock.callCount(), 1);
      equal(program.fatalError.mock.callCount(), 1);
      caught = true
    }
    equal(caught, true)
  });

  it(`should fatalError() for a rejected promise (error object)`, async () => {
    const program = new Program();
    const action = mock.fn(() => Promise.reject(new Error('Failed!')));
    program.fatalError = mock.fn()
    program
      .version('1.0.0')
      .command('foo', 'My foo')
      .action(action);

    let caught = false;
    try {
      await program.parse(makeArgv('foo'))
    } catch {
      equal(action.mock.callCount(), 1);
      equal(program.fatalError.mock.callCount(), 1);
      caught = true
    }
    equal(caught, true)
  });
});
