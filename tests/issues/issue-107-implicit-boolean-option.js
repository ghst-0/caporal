import { describe, beforeEach, afterEach, it } from 'node:test';
import { equal } from 'node:assert/strict';
import sinon from 'sinon';

import { Program } from '../../lib/program.js';
import { makeArgv } from '../utils/make-argv.js';

describe('Issue #107 - Implicit boolean option', () => {
  // having the shorthand and the longhand
  beforeEach(() => {
    this.program = new Program();
    this.action = sinon.spy();
    this.program
        .version('1.0.0')
      .command('cmd', 'Command')
      .option('-b, --bool', 'Implicit boolean')
      .argument('[a]', 'A', this.program.INT)
      .action(this.action);
    this.fatalError = sinon.stub(this.program, "fatalError");
  });

  afterEach(() => {
    this.fatalError.restore();
    this.program.reset();
  });

  it(`should call the action with {a: 1} and {bool: true}`, () => {
    this.program.parse(makeArgv(['cmd', '-b', '1']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
    equal(this.action.calledWith({a: 1}, {bool: true}), true);
  });

  it(`should call the action with {} and {bool: true}`, () => {
    this.program.parse(makeArgv(['cmd', '-b']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
    equal(this.action.calledWith({}, {bool: true}), true);
  });

  it(`should call the action with {a: 1} and {bool: false}`, () => {
    this.program.parse(makeArgv(['cmd', '1']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
    equal(this.action.calledWith({a: 1}, {bool: false}), true);
  });
});

context('only having the longhand', () => {
  beforeEach(() => {
    this.program = new Program();
    this.action = sinon.spy();
    this.program
        .version('1.0.0')
      .command('cmd', 'Command')
      .option('--bool', 'Implicit boolean')
      .argument('[a]', 'A', this.program.INT)
      .action(this.action);
    this.fatalError = sinon.stub(this.program, "fatalError");
  });

  afterEach(() => {
    this.fatalError.restore();
    this.program.reset();
  });

  it(`should call the action with {a: 1} and {bool: true}`, () => {
    this.program.parse(makeArgv(['cmd', '--bool', '1']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
    equal(this.action.calledWith({a: 1}, {bool: true}), true);
  });

  it(`should call the action with {} and {bool: true}`, () => {
    this.program.parse(makeArgv(['cmd', '--bool']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
    equal(this.action.calledWith({}, {bool: true}), true);
  });

  it(`should call the action with {a: 1} and {bool: false}`, () => {
    this.program.parse(makeArgv(['cmd', '1']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
    equal(this.action.calledWith({a: 1}, {bool: false}), true);
  });
});

context('only having the shorthand', () => {
  beforeEach(() => {
    this.program = new Program();
    this.action = sinon.spy();
    this.program
        .version('1.0.0')
      .command('cmd', 'Command')
      .option('-b', 'Implicit boolean')
      .argument('[a]', 'A', this.program.INT)
      .action(this.action);
    this.fatalError = sinon.stub(this.program, "fatalError");
  });

  afterEach(() => {
    this.fatalError.restore();
    this.program.reset();
  });

  it(`should call the action with {a: 1} and {b: true}`, () => {
    this.program.parse(makeArgv(['cmd', '-b', '1']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
    equal(this.action.calledWith({a: 1}, {b: true}), true);
  });

  it(`should call the action with {} and {b: true}`, () => {
    this.program.parse(makeArgv(['cmd', '-b']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
    equal(this.action.calledWith({}, {b: true}), true);
  });

  it(`should call the action with {a: 1} and {b: false}`, () => {
    this.program.parse(makeArgv(['cmd', '1']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
    equal(this.action.calledWith({a: 1}, {b: false}), true);
  });
});
