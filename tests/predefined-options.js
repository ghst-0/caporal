import { equal } from 'node:assert/strict';
import sinon from 'sinon';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

const program = new Program();

program
  .version('1.0.0');

describe('Predefined options', function() {

  it(`-V should return program version (${program.version()})`, function() {
    const version = sinon.stub(program, "version");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv('-V'));
    equal(version.called, true);
    equal(exit.callCount, 1);
    exit.restore();
    version.restore();
  });

  it(`--version should return program version (${program.version()})`, function() {
    const version = sinon.stub(program, "version");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv('--version'));
    equal(version.called, true);
    equal(exit.callCount, 1);
    exit.restore();
    version.restore();
  });

  it(`-h should call help() when only one command`, function() {
    program
      .reset()
      .command('foo', 'My foo');

    const exit = sinon.stub(process, "exit");
    const help = sinon.spy(program, "_help");
    program.parse(makeArgv(['foo', '-h']));
    equal(help.called, true);
    equal(exit.callCount, 1);
    exit.restore();
    help.restore();
  });

  it(`-h should call help() when more than one command`, function() {
    program
      .reset()
      .command('foo', 'My foo')
      .command('bar', 'My bar');

    const exit = sinon.stub(process, "exit");
    const help = sinon.spy(program, "_help");
    program.parse(makeArgv(['foo', '-h']));
    equal(help.called, true);
    equal(exit.callCount, 1);
    exit.restore();
    help.restore();
  });
});
