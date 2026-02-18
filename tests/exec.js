import { describe, it, mock } from 'node:test';
import { equal } from 'node:assert/strict';

import { Program } from '../lib/program.js';

describe('Execute command', () => {

  const program = new Program();
  const actionFoo = mock.fn();
  const actionBar = mock.fn();

  program
    .version('1.0.0')
    .command('foo')
    .option('--foo-option', 'foo option', program.INT, 1)
    .action(actionFoo)
    .command('bar')
    .option('--bar-option', 'bar option', program.INT, 2)
    .action(actionBar)

  it('should execute 1 command', () => {
    program.exec(['foo'], {
      'fooOption': 11,
    });

    equal(actionFoo.mock.callCount(), 1);
    equal(actionBar.mock.callCount(), 0);
  });
});
