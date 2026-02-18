import sinon from 'sinon';
import should from 'should';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

import { stripColor } from './utils/strip-color.js';

const program = new Program();

program
  .version('1.0.0');


describe('Passing --foo', () => {

  it(`should suggest --foor and --afoo and --footx`, () => {
    program
      .option('--foor <foor>')
      .option('--afoo <afoo>')
      .option('--footx <footx>')
      .action(function() {});

    const error = sinon.stub(program, "fatalError", function(err) {
      should(err.name).eql('UnknownOptionError');
      should(stripColor(err.originalMessage)).containEql('foor');
      should(stripColor(err.originalMessage)).containEql('afoo');
      should(stripColor(err.originalMessage)).containEql('footx');
    });
    program.parse(makeArgv('--foo'));
    should(error.callCount).be.eql(1);
    error.restore();
    program.reset();
  });
});
