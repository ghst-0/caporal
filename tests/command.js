import sinon from 'sinon';
import should from 'should';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';
describe('Chaining 2 commands', () => {

  const program = new Program();

  program
      .version('1.0.0')
    .command('foo')
    .action(function() {})
    .command('bar')
    .action(function() {})

  it(`should generate 2 commands`, () => {
    program.parse(makeArgv(['foo']));
    should(program._commands.length).eql(2);
  });


});

describe('Aliasing a command', () => {

  const program = new Program();

  const action = sinon.stub();

  program
      .version('1.0.0')
    .command('foo')
    .alias('f')
    .action(action);

  it(`should allow calling it with alias`, () => {
    program.parse(makeArgv(['f']));
    should(action.callCount).be.eql(1);
  });


});


