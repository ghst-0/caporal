import { describe, it, mock } from 'node:test';
import { deepEqual, equal } from 'node:assert/strict';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

const program = new Program();

program
  .version('1.0.0');

describe('Setting up an invalid validator flag', () => {

  it(`should throw ValidationError`, () => {

    program.fatalError = mock.fn((err) => {
      equal(err.name, 'ValidationError');
    });

    program
      .command('foo')
      .option('-t <time-in-secs>', 'my option', 256)
      .action(() => {});

    program.parse(makeArgv(['foo', '-t', '2982']));
    equal(program.fatalError.mock.callCount(), 1);
    program.fatalError.mock.restore();
    program.reset();
  });
});

describe('Setting up an invalid validator (boolean)', () => {

  it(`should throw ValidationError`, () => {

    program.fatalError = mock.fn((err) => {
      equal(err.name, 'ValidationError');
    });

    program
      .command('foo')
      .option('-t <time-in-secs>', 'my option', true)
      .action(() => {});

    program.parse(makeArgv(['foo', '-t', '2982']));
    equal(program.fatalError.mock.callCount(), 1);
    program.fatalError.mock.restore();
    program.reset();
  });
});

describe('Setting up an option without validator', () => {

  it(`should return empty array for option.getChoices()`, () => {

    program
      .command('foo')
      .option('-t <time-in-secs>', 'my option')
      .action(() => {});

    program.parse(makeArgv(['foo', '-t', '2982']));
    deepEqual(program.getCommands()[0]._options[0].getChoices(), []);
    program.reset();
  });
});

describe('Setting up an option with an non-Array validator', () => {

  it(`should return empty array for validator.getChoices()`, () => {

    program
      .command('foo')
      .option('-t <time-in-secs>', 'my option', program.INT)
      .action(() => {});

    program.parse(makeArgv(['foo', '-t', '2982']));
    deepEqual(program.getCommands()[0]._options[0]._validator.getChoices(), []);
    program.reset();
  });
});

describe('Setting up an option with a function validator', () => {

  it(`should return empty array for validator.getChoices()`, () => {

    program
      .command('foo')
      .option('-t <time-in-secs>', 'my option', opt => opt)
      .action(() => {});

    program.parse(makeArgv(['foo', '-t', '2982']));
    deepEqual(program.getCommands()[0]._options[0]._validator.getChoices(), []);
    program.reset();
  })
})

describe('Setting up an option with a promise validator', () => {

  it(`should return empty array for validator.getChoices()`, () => {

    program
      .command('foo')
      .option('-t <time-in-secs>', 'my option', opt => Promise.resolve(opt))
      .action(() => {});

    program.parse(makeArgv(['foo', '-t', '2982']));
    deepEqual(program.getCommands()[0]._options[0]._validator.getChoices(), []);
    program.reset();
  })
})
