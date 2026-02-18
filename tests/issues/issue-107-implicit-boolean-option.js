import { describe, beforeEach, afterEach, it, mock } from 'node:test';
import { deepEqual, equal } from 'node:assert/strict';

import { Program } from '../../lib/program.js';
import { makeArgv } from '../utils/make-argv.js';

let program
let action
let fatalError

describe('Issue #107 - Implicit boolean option', () => {
  // having the shorthand and the longhand
  beforeEach(() => {
    program = new Program();
    action = mock.fn();
    program
      .version('1.0.0')
      .command('cmd', 'Command')
      .option('-b, --bool', 'Implicit boolean')
      .argument('[a]', 'A', program.INT)
      .action(action);
    fatalError = mock.fn()
  });

  afterEach(() => {
    fatalError.mock.restore();
    program.reset();
  });

  it(`should call the action with {a: 1} and {bool: true}`, () => {
    program.parse(makeArgv(['cmd', '-b', '1']));
    equal(fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{a: 1}, {bool: true}]);
  });

  it(`should call the action with {} and {bool: true}`, () => {
    program.parse(makeArgv(['cmd', '-b']));
    equal(fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{}, {bool: true}]);
  });

  it(`should call the action with {a: 1} and {bool: false}`, () => {
    program.parse(makeArgv(['cmd', '1']));
    equal(fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{a: 1}, {bool: false}]);
  });
});

describe('only having the longhand', () => {
  beforeEach(() => {
    program = new Program();
    action = mock.fn();
    program
        .version('1.0.0')
      .command('cmd', 'Command')
      .option('--bool', 'Implicit boolean')
      .argument('[a]', 'A', program.INT)
      .action(action);
    fatalError = mock.fn();
  });

  afterEach(() => {
    fatalError.mock.restore();
    program.reset();
  });

  it(`should call the action with {a: 1} and {bool: true}`, () => {
    program.parse(makeArgv(['cmd', '--bool', '1']));
    equal(fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{a: 1}, {bool: true}]);
  });

  it(`should call the action with {} and {bool: true}`, () => {
    program.parse(makeArgv(['cmd', '--bool']));
    equal(fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{}, {bool: true}]);
  });

  it(`should call the action with {a: 1} and {bool: false}`, () => {
    program.parse(makeArgv(['cmd', '1']));
    equal(fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{a: 1}, {bool: false}]);
  });
});

describe('only having the shorthand', () => {
  beforeEach(() => {
    program = new Program();
    action = mock.fn();
    program
      .version('1.0.0')
      .command('cmd', 'Command')
      .option('-b', 'Implicit boolean')
      .argument('[a]', 'A', program.INT)
      .action(action);
    fatalError = mock.fn();
  });

  afterEach(() => {
    fatalError.mock.restore();
    program.reset();
  });

  it(`should call the action with {a: 1} and {b: true}`, () => {
    program.parse(makeArgv(['cmd', '-b', '1']));
    equal(fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{a: 1}, {b: true}]);
  });

  it(`should call the action with {} and {b: true}`, () => {
    program.parse(makeArgv(['cmd', '-b']));
    equal(fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{}, {b: true}]);
  });

  it(`should call the action with {a: 1} and {b: false}`, () => {
    program.parse(makeArgv(['cmd', '1']));
    equal(fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{a: 1}, {b: false}]);
  });
});
