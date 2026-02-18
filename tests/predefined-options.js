import { describe, it, mock } from 'node:test';
import { equal } from 'node:assert/strict';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

const program = new Program();

program
  .version('1.0.0');

describe('Predefined options', function() {

  it(`-V should return program version (${program.version()})`, function() {
    program.version = mock.fn();
    process.exit = mock.fn();
    program.parse(makeArgv('-V'));
    equal(program.version.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    process.exit.mock.restore();
    program.version.mock.restore();
  });

  it(`--version should return program version (${program.version()})`, function() {
    program.version = mock.fn();
    process.exit = mock.fn();
    program.parse(makeArgv('--version'));
    equal(program.version.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    process.exit.mock.restore();
    program.version.mock.restore();
  });

  it(`-h should call help() when only one command`, function() {
    program
      .reset()
      .command('foo', 'My foo');

    process.exit = mock.fn();
    mock.method(program, '_help');
    program.parse(makeArgv(['foo', '-h']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
  });

  it(`-h should call help() when more than one command`, function() {
    program
      .reset()
      .command('foo', 'My foo')
      .command('bar', 'My bar');

    process.exit = mock.fn();
    mock.method(program, '_help');
    program.parse(makeArgv(['foo', '-h']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
  });
});
