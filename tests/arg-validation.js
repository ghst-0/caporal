import { describe, beforeEach, afterEach, it, mock } from 'node:test';
import { equal, deepEqual } from 'node:assert/strict';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

import { InvalidArgumentValueError } from '../lib/error/invalid-argument-value.js';
import { WrongNumberOfArgumentError } from '../lib/error/wrong-num-of-arg.js';

const program = new Program();
let action

program
  .version('1.0.0')
  .reset()
  .command('foo', 'Fooooo')
  .argument('<foo>', 'My bar', /^[a-z]+$/)
  .action(() => {});

describe("Argument validation", () => {

  beforeEach(() => {
    program.fatalError = mock.fn()
    action = mock.fn();
  });

  afterEach(() => {
    program.fatalError.mock.restore();
    program.reset();
  });

  it(`should throw InvalidArgumentValueError for an invalid required argument value (Regex validator)`, () => {
    program.parse(makeArgv(['foo', '827E92']))
    const args = program.fatalError.mock.calls[0].arguments;
    equal(program.fatalError.mock.callCount(), 1);
    equal(args[0] instanceof InvalidArgumentValueError, true);
  });

  it(`should throw InvalidArgumentValueError for an invalid optional argument value (Regex validator)`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('[foo]', 'My bar', /^[a-z]+$/)
      .action(action);

    program.parse(makeArgv(['foo', '827E92']));
    equal(program.fatalError.mock.callCount(), 1);
    equal(program.fatalError.mock.calls[0].arguments[0] instanceof InvalidArgumentValueError, true);
  });

  it(`should throw InvalidArgumentValueError for an invalid optional argument value (Array validator)`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('[foo]', 'My bar', ["bim", "bam", "boom"])
      .action(action);

    program.parse(makeArgv(['foo', '827E92']));
    equal(program.fatalError.mock.callCount(), 1);
    equal(program.fatalError.mock.calls[0].arguments[0] instanceof InvalidArgumentValueError, true);
  });


  it(`should throw InvalidArgumentValueError for an invalid required argument value (Array validator)`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('<foo>', 'My bar', ["bim", "bam", "boom"])
      .action(action);

    program.parse(makeArgv(['foo', '827E92']));
    equal(program.fatalError.mock.callCount(), 1);
    equal(program.fatalError.mock.calls[0].arguments[0] instanceof InvalidArgumentValueError, true);
  });

  it(`should not throw InvalidArgumentValueError for an valid required argument value (Array validator)`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('<foo>', 'My bar', ["bim", "bam", "boom"])
      .action(action);

    program.parse(makeArgv(['foo', 'bam']));
    equal(program.fatalError.mock.callCount(), 0);
  });

  it(`should throw InvalidArgumentValueError for an invalid required argument value (Function validator)`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('<foo>', 'My bar', arg => {
        const options = ["bim", "bam", "boom"];
        if (options.includes(arg)) {
          return arg;
        }
        throw new Error();
      })
      .action(action);

    program.parse(makeArgv(['foo', '827E92']));
    equal(program.fatalError.mock.callCount(), 1);
    equal(program.fatalError.mock.calls[0].arguments[0] instanceof InvalidArgumentValueError, true);
  });

  it(`should not throw InvalidArgumentValueError for a valid required argument value (Function validator)`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('<foo>', 'My bar', arg => {
        const options = ["bim", "bam", "boom"];
        if (options.includes(arg)) {
          return arg;
        }
        throw new Error();
      })
      .action(action);

    program.parse(makeArgv(['foo', 'bam']));
    equal(program.fatalError.mock.callCount(), 0);
  });

  it(`should throw InvalidArgumentValueError for an invalid required argument value (Promise validator)`, (done) => {
    program
      .command('foo', 'Fooooo')
      .argument('<foo>', 'My bar', arg => new Promise((resolve, reject) => {
        const options = new Set(["bim", "bam", "boom"]);
        setTimeout(() => {
          if (options.has(arg)) {
            resolve(arg)
          } else {
            reject(new Error())
          }
        }, 10);
      }))
      .action(action);

    program.parse(makeArgv(['foo', '827E92']))
      .catch(() => {
        const args = program.fatalError.mock.calls[0].arguments;
        equal(program.fatalError.mock.callCount(), 1);
        equal(args[0] instanceof InvalidArgumentValueError, true);
        done()
      });
  });

  it(`should not throw InvalidArgumentValueError for a valid required argument value (Promise validator)`, (done) => {
    program
      .command('foo', 'Fooooo')
      .argument('<foo>', 'My bar', arg => new Promise((resolve, reject) => {
        const options = new Set(["bim", "bam", "boom"]);
        setTimeout(() => {
          if (options.has(arg)) {
            resolve(arg)
          } else {
            reject(new Error())
          }
        }, 10);
      }))
      .action(action);

    program.parse(makeArgv(['foo', 'bam'])).then(_arg => {
      equal(program.fatalError.mock.callCount(), 0);
      done();
    })
  });

  it(`should take default value if not passed when setting up a default argument value`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('[foo]', 'My bar', /^[a-z]+$/, 'bar')
      .action(action);

    program.parse(makeArgv(['foo']));
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments, [{foo:"bar"}, {}]);
    equal(program.fatalError.mock.callCount(), 0);
  });

  it(`should throw WrongNumberOfArgumentError when passing an unknown argument for a command that does not accept arguments`, () => {
    program
      .command('foo', 'Fooooo')
      .action(action);

    program.parse(makeArgv(['foo', '827E92']));
    equal(program.fatalError.mock.callCount(), 1);
    equal(program.fatalError.mock.calls[0].arguments instanceof WrongNumberOfArgumentError, true);
  });

  it(`should throw WrongNumberOfArgumentError for a known command when forgetting an argument`, () => {

    program
      .command('foo', 'Fooooo')
      .argument('<joe>', 'max')
      .argument('<jiji...>', 'jiji')
      .action(action);

    program.parse(makeArgv(['foo']));
    const args = program.fatalError.mock.calls[0].arguments;
    equal(program.fatalError.mock.callCount(), 1);
    equal(args[0] instanceof WrongNumberOfArgumentError, true);
  });

  it(`should throw WrongNumberOfArgumentError for a default command when forgetting an argument`, () => {
    program
      .argument('<joe>', 'max')
      .argument('<jiji...>', 'jiji')
      .action(action);

    program.parse(makeArgv(['foo']));
    const args = program.fatalError.mock.calls[0].arguments;
    equal(program.fatalError.mock.callCount(), 1);
    equal(args[0] instanceof WrongNumberOfArgumentError, true);
  });

  it(`should not throw any error when passing an argument without validator`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('<foo>', 'My foo')
      .action(action);

    program.parse(makeArgv(['foo', '827E-Z92']));
    equal(program.fatalError.mock.callCount(), 0);
  });

  it(`should return an array for variadic arguments without validator`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('[foo]', 'My bar', /^[a-z]+$/, 'bar')
      .argument('[other-foo...]', 'Other foo')
      .action(action);

    program.parse(makeArgv(['foo', 'bar', 'im', 'a', 'variadic', 'arg']));
    equal(program.fatalError.mock.callCount(), 0);
    equal(action.mock.calls[0].arguments, [{foo: "bar", otherFoo: ['im', 'a', 'variadic', 'arg']}])
  });

  it(`should handled optional arguments with no default and no validator`, () => {
    program
      .command('foo', 'Fooooo')
      .argument('[foo]', 'My bar', /^[a-z]+$/)
      .action(action);

    program.parse(makeArgv(['foo']));
    equal(action.mock.callCount(), 1);
  });

  it(`should hanldle negative numbers in quoted arguments`, () => {
    program
      .command('order', 'Order something')
      .argument('<what>', 'What to order', ["pizza", "burger", "smoothie"])
      .argument('<how-much>', 'How much', program.INT)
      .action(action);

    program.parse(makeArgv(['order', "pizza", '-1']));
    equal(program.fatalError.mock.callCount(), 0);
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments[0], { what: 'pizza', howMuch: -1 });
  });

  it(`should not throw any error when passing an handled argument to completion`, () => {
    program.parse(makeArgv(['completion', 'zsh']));
    equal(program.fatalError.mock.callCount(), 0);
  });

});
