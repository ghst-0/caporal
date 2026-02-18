import { describe, it, beforeEach, afterEach } from 'node:test';
import { equal, throws } from 'node:assert/strict';
import sinon from 'sinon';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

let program;

describe("program.fatalError()", () => {

  beforeEach(function () {
    program = new Program();

    program
      .version('1.0.0');
  });

  it(`should call console.error() and exit(2)`, () => {
    const error = sinon.stub(console, 'error').withArgs("\nfoo");
    const exit = sinon.stub(process, 'exit').withArgs(2);

    program.fatalError(new Error("foo"));

    equal(error.callCount, 1);
    equal(exit.callCount, 1);
  });

  it(`should call console.error() and exit(2) - verbose`, () => {
    const error = sinon.stub(console, 'error').withArgs(sinon.match('Error: foo\n    at '));
    const exit = sinon.stub(process, 'exit').withArgs(2);

    program
      .command('foo', 'Fooooo')
      .action(() => { throw new Error('foo'); });

    throws(program.parse.bind(program, makeArgv(['foo', '-v'])))

    // TODO: Mocking
    equal(error.callCount, 1);
    equal(exit.callCount, 1);
  });

  it(`should call console.error() and exit(2) - normal`, () => {
    const error = sinon.stub(console, 'error').withArgs("\nfoo");
    const exit = sinon.stub(process, 'exit').withArgs(2);

    program
      .command('foo', 'Fooooo')
      .action(() => { throw new Error('foo'); });

    throws(program.parse.bind(program, makeArgv(['foo'])));

    equal(error.callCount, 1);
    equal(exit.callCount, 1);
  });

  it(`should call console.error() and exit(2) - async`, (done) => {
    const error = sinon.stub(console, 'error').withArgs("\nfoo");
    const exit = sinon.stub(process, 'exit').withArgs(2);

    program
      .command('foo', 'Fooooo')
      .action(() => {
        return new Promise((resolve, reject) => {
          reject(new Error('foo'));
        });
      });

    program.parse(makeArgv(['foo'])).catch(() => {
      equal(error.callCount, 1);
      equal(exit.callCount, 1);
      done();
    });
  });

  it(`should call console.error() and exit(2) - throw non-exception sync`, () => {
    const error = sinon.stub(console, 'error').withArgs("\nfoo");
    const exit = sinon.stub(process, 'exit').withArgs(2);

    program
      .command('foo', 'Fooooo')
      .action(() => { throw 'foo'; });

    throws(program.parse.bind(program, makeArgv(['foo'])));

    equal(error.callCount, 1);
    equal(exit.callCount, 1);
  });

  it(`should call console.error() and exit(2) - throw non-exception async`, (done) => {
    const error = sinon.stub(console, 'error').withArgs("\nfoo");
    const exit = sinon.stub(process, 'exit').withArgs(2);

    program
      .command('foo', 'Fooooo')
      .action(() => {
        return new Promise((resolve, reject) => {
          reject('foo');
        });
      });

    program.parse(makeArgv(['foo'])).catch(() => {
      equal(error.callCount, 1);
      equal(exit.callCount, 1);
      done();
    });
  });

  afterEach(function () {
    console.error.restore();
    process.exit.restore();
  })
});
