import { equal } from 'node:assert/strict';
import sinon from 'sinon';

import { Program } from '../../lib/program.js';
import { makeArgv } from '../utils/make-argv.js';

describe("Issue #13 - Enter negative number as Argument", function() {

  beforeEach(function () {

    this.program = new Program();
    this.action = sinon.spy();

    this.program
      .version('1.0.0')
      .command('solve', 'Solve quadratic')
      .argument('<a>', 'A', this.program.INT)
      .argument('<b>', 'B', this.program.INT)
      .argument('<c>', 'C', this.program.INT)
      .action(this.action);

    this.fatalError = sinon.stub(this.program, "fatalError");
  });

  afterEach(function () {
    this.fatalError.restore();
    this.program.reset();
  });

  it(`should not throw WrongNumberOfArgumentError with negative number as argument`, function() {
    this.program.parse(makeArgv(['solve', '1', '2', '-3']));
    equal(this.fatalError.callCount, 0);
    equal(this.action.callCount, 1);
  });
});
