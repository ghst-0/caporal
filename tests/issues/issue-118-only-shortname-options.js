import sinon from 'sinon';
import should from 'should';
import * as c from 'colorette';

import { Program } from '../../lib/program.js';
import { makeArgv } from '../utils/make-argv.js';

const program = new Program();

program
  .version('1.0.0')
  .command('issue118', 'Fix!');

describe('Issue #118 - Unknown option --undefined', () => {
  it('should return shortname in error text whenever longname is not provided', () => {

    sinon.stub(program, 'fatalError', (err) => {
      should(err.name).eql('MissingOptionError');
      should(err.originalMessage).equal(`Missing option ${c.italic('-z')}.`);
    });
    program.option('-z <whatever>', 'Random option', program.INT, null, true);
    program.parse(makeArgv([]));

  });
});
