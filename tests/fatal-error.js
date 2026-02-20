import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import { equal, throws } from 'node:assert/strict';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

let program;

describe("program.fatalError()", () => {

  beforeEach(() => {
    program = new Program();

    program
      .version('1.0.0');
  });

  it(`should call console.error() and exit(2)`, () => {
    console.error = mock.fn();
    process.exit = mock.fn();

    program.fatalError(new Error("foo"));

    equal(console.error.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
  });

  it(`should call console.error() and exit(2) - verbose`, () => {
    console.error = mock.fn();
    process.exit = mock.fn();

    program
      .command('foo', 'Fooooo')
      .action(() => { throw new Error('foo'); });

    throws(program.parse.bind(program, makeArgv(['foo', '-v'])))

    equal(console.error.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
  });

  it(`should call console.error() and exit(2) - normal`, () => {
    console.error = mock.fn();
    process.exit = mock.fn();

    program
      .command('foo', 'Fooooo')
      .action(() => { throw new Error('foo'); });

    throws(program.parse.bind(program, makeArgv(['foo'])));

    equal(console.error.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
  });

  it(`should call console.error() and exit(2) - async`, async () => {
    console.error = mock.fn();
    process.exit = mock.fn();

    program
      .command('foo', 'Fooooo')
      .action(() => {
        return new Promise((resolve, reject) => {
          reject(new Error('foo'));
        });
      });

    let caught = false;
    try {
      await program.parse(makeArgv(['foo']))
    } catch {
      equal(console.error.mock.callCount(), 1);
      equal(process.exit.mock.callCount(), 1);
      caught = true;
    }
    equal(caught, true);
  });

  it(`should call console.error() and exit(2) - throw non-exception sync`, () => {
    console.error = mock.fn();
    process.exit = mock.fn();

    program
      .command('foo', 'Fooooo')
      .action(() => { throw 'foo'; });

    throws(program.parse.bind(program, makeArgv(['foo'])));

    equal(console.error.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
  });

  it(`should call console.error() and exit(2) - throw non-exception async`, async () => {
    console.error = mock.fn();
    process.exit = mock.fn();

    program
      .command('foo', 'Fooooo')
      .action(() => {
        return new Promise((resolve, reject) => {
          reject('foo');
        });
      });

    let caught = false;
    try {
      await program.parse(makeArgv(['foo']))
    }
    catch {
      equal(console.error.mock.callCount(), 1);
      equal(process.exit.mock.callCount(), 1);
      caught = true;
    }
    equal(caught, true);
  });

  afterEach(() => {
    console.error.mock.restore();
    process.exit.mock.restore();
  })
});
