import { describe, beforeEach, afterEach, it, mock } from 'node:test';
import { deepEqual, equal } from 'node:assert/strict';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

const program = new Program();

program
  .version('1.0.0');

describe('Passing --option invalid-value', () => {

  beforeEach(() => {
    program.action(() => {});
    program.fatalError = mock.fn( (err) => {
      equal(err.name, 'InvalidOptionValueError');
    });
  });

  afterEach(() => {
    program.fatalError.mock.restore();
    program.reset();
  });

  for (const checkType of ['regex', 'function', 'STRING', 'INT', 'BOOL', 'FLOAT', 'LIST(int)', 'LIST(bool)', 'LIST(float)', 'LIST(repeated)']) {
    it(`should throw an error for ${checkType} check`, () => {
      program.action(() => {});

      if (checkType === 'regex') {
        program.option('-t, --time <time-in-secs>', 'Time in seconds', /^\d+$/);
        program.parse(makeArgv(['-t', 'i-am-invalid']));

      } else if(checkType === 'function') {
        program.option('-t, --time <time-in-secs>', 'Time in seconds, superior to zero', (val) => {
          const o = Number.parseInt(val);
          if (Number.isNaN(o) || o <= 0) {
            throw new Error("'time' must be a valid number")
          }
          return o;
        });
        program.parse(makeArgv(['-t', 'i-am-invalid']));

      } else if(checkType === 'STRING') {
        program.option('-f, --file <file>', 'Time in seconds', program.STRING);
        program.parse(makeArgv(['-f']));

      } else if(checkType === 'INT') {
        program.option('-t, --time <time-in-secs>', 'Time in seconds', program.INT);
        program.parse(makeArgv(['-t', 'i-am-invalid']));

      } else if(checkType === 'BOOL') {
        program.option('--happy <value>', 'Am I happy ?', program.BOOLEAN);
        program.parse(makeArgv(['--happy', 'i-am-invalid']));

      } else if(checkType === 'FLOAT') {
        program.option('-t, --time <time-in-secs>', 'Time in seconds', program.FLOAT);
        program.parse(makeArgv(['-t', 'i-am-invalid']));

      } else if(checkType === 'LIST(int)') {
        program.option('-l, --list <list>', 'My list', program.LIST | program.INT);
        program.parse(makeArgv(['--list', '0,1,A']));

      } else if(checkType === 'LIST(bool)') {
        program.option('-l, --list <list>', 'My list', program.LIST | program.BOOL);
        program.parse(makeArgv(['--list', 'true,0,fake']));

      } else if(checkType === 'LIST(float)') {
        program.option('-l, --list <list>', 'My list', program.LIST | program.FLOAT);
        program.parse(makeArgv(['--list', '1.0,0,fake']));
      }
      else if(checkType === 'LIST(repeated)') {
        program.option('-l, --list <list>', 'My list', program.LIST | program.FLOAT);
        program.parse(makeArgv(['--list', '1.0', '--list','fake']));
      }

      const count = program.fatalError.mock.callCount();

      equal(count, 1);
    });
  }

  it(`should throw an error for promise check`, async () => {
    program.action(() => {});

    program.option('-t, --time <time-in-secs>', 'Time in seconds, superior to zero', (val) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const o = Number.parseInt(val);
          if (Number.isNaN(o) || o <= 0) {
            reject(new Error("FOOOO"));
          }
          else {
            resolve(o);
          }
        }, 10);
      })
    });
    // then.catch.then to ensure the assertion is made whether the promise resolves or not (simulates `finally` behavior for node 6 & 8)
    let caught = false;
    try {
      await program.parse(makeArgv(['-t', 'i-am-invalid']))
    }
    catch {
      equal(program.fatalError.mock.callCount(), 1);
      caught = true;
    }
    equal(caught, true);
  });
});


describe('Passing --option valid-value', () => {

  beforeEach(() => {
    program.action(() => {});
    program.fatalError = mock.fn();
  });

  afterEach(() => {
    program.fatalError.mock.restore();
    program.reset();
  });

  ['regex', 'function', 'STRING', 'INT', 'BOOL', 'BOOL(implicit)', 'FLOAT', 'LIST(int)', 'LIST(bool)', 'LIST(float)'].forEach((checkType) => {
    it(`should succeed for ${checkType} check`, () => {
      if (checkType === 'regex') {
        program.action((args, options) => {
          equal(options.time, '234');
        });
        program.option('-t, --time <time-in-secs>', 'Time in seconds', /^\d+$/);
        program.parse(makeArgv(['-t', '234']));

      } else if (checkType === 'function') {
        program.action((args, options) => {
          equal(options.time, 2);
        });
        program.option('-t, --time <time-in-secs>', 'Time in seconds, superior to zero', (val) => {
          const o = Number.parseInt(val);
          if (Number.isNaN(o) || o <= 0) {
            throw new Error("FOOOO")
          }
          return o;
        });
        program.parse(makeArgv(['-t', '2']));

      } else if (checkType === 'STRING') {
        program.action((args, options) => {
          equal(options.file, 'foo')
        });
        program.option('-f, --file <file>', 'File', program.STRING);
        program.parse(makeArgv(['-f', 'foo']));

      } else if (checkType === 'INT') {
        program.action((args, options) => {
          equal(options.time, 282);
        });
        program.option('-t, --time <time-in-secs>', 'Time in seconds', program.INT);
        program.parse(makeArgv(['-t', '282']));

      } else if (checkType === 'BOOL') {
        program.action((args, options) => {
          equal(options.happy, true);
        });
        program.option('--happy <value>', 'Am I happy ?', program.BOOLEAN);
        program.parse(makeArgv(['--happy', 'yes']));

      } else if (checkType === 'BOOL(implicit)') {
        program.action((args, options) => {
          equal(options.happy, true);
        });
        program.option('--happy', 'Am I happy ?', program.BOOLEAN);
        program.parse(makeArgv(['--happy']));

      } else if (checkType === 'FLOAT') {
        program.action((args, options) => {
          equal(options.time, 2.8);
        });
        program.option('-t, --time <time-in-secs>', 'Time in seconds', program.FLOAT);
        program.parse(makeArgv(['-t', '2.8']));

      } else if (checkType === 'LIST(int)') {
        program.action((args, options) => {
          deepEqual(options.list, [1, 8]);
        });
        program.option('-l, --list <list>', 'My list', program.LIST | program.INT);
        program.parse(makeArgv(['--list', '1,8']));

      } else if (checkType === 'LIST(bool)') {
        program.action((args, options) => {
          deepEqual(options.list, [true, false, true, false, true, false]);
        });
        program.option('-l, --list <list>', 'My list', program.LIST | program.BOOL);
        program.parse(makeArgv(['--list', 'true,0,yes,no,1,false']));

      } else if (checkType === 'LIST(float)') {
        program.action((args, options) => {
          deepEqual(options.list, [1.0, 0]);
        });
        program.option('-l, --list <list>', 'My list', program.LIST | program.FLOAT);
        program.parse(makeArgv(['--list', '1.0,0']));
      }

      const count = program.fatalError.mock.callCount();

      equal(count, 0);
    });
  });

  it(`should succeed for promise check`, () => {
    let time = 0;
    program.action((args, options) => { time = options.time });

    program.option('-t, --time <time-in-secs>', 'Time in seconds, superior to zero', (val) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const o = Number.parseInt(val);
          if (Number.isNaN(o) || o <= 0) {
            reject(new Error("FOOOO"));
          }
          else {
            resolve(o);
          }
        }, 10);
      })
    });
    // then.catch.then to ensure the assertion is made whether the promise resolves or not (simulates `finally` behavior for node 6 & 8)\
    let caught = false;
    try {
      program.parse(makeArgv(['-t', '2']))
    }
    catch {
      /**/
    }
    finally {
      try {
        equal(program.fatalError.mock.callCount(), 0);
        equal(time, 2);
        caught = true;
      } catch {
        caught = true;
      }
    }
    equal(caught, true);
  });
});


describe('Passing --unknown-option (long)', () => {

  it(`should throw UnknownOptionError`, () => {
    program
      .option('-t, --time <time-in-secs>')
      .action(() => {});

    program.fatalError = mock.fn((err) => {
      equal(err.name, 'UnknownOptionError');
    });
    program.parse(makeArgv('--unknown-option'));
    equal(program.fatalError.mock.callCount(), 1);
    program.fatalError.mock.restore();
    program.reset();
  });
});

describe('Setting up an option with a default value', () => {
  it(`should take default value if nothing is passed`, () => {

    program
      .reset()
      .command('foo', 'Fooooo')
      .option('--foo <foo-value>', 'My bar', /^[a-z]+$/, 'bar')
      .action((args, options) =>{
        equal(options.foo, 'bar');
      });

    program.fatalError = mock.fn();
    program.parse(makeArgv(['foo']));
    equal(program.fatalError.mock.callCount(), 0);
    program.reset();
    program.fatalError.mock.restore();
  });
});

describe('Setting up an option with an optional value', () => {
  it(`should work when no value is passed`, () => {

    program
      .reset()
      .command('foo', 'Fooooo')
      .option('--with-openssl [path]', 'Compile with openssl')
      .action((args, options) => {
        equal(options.withOpenssl, true);
      });

    program.fatalError = mock.fn()
    program.parse(makeArgv(['foo', '--with-openssl']));
    equal(program.fatalError.mock.callCount(), 0);
    program.reset();
  });
});



describe('Passing an unknown short option', () => {

  it(`should throw an error`, () => {
    program
      .reset()
      .option('-t, --time <time-in-secs>')
      .action(() => {});

    program.fatalError = mock.fn((err) => {
      equal(err.name, 'UnknownOptionError');
    });
    program.parse(makeArgv('-u'));
    equal(program.fatalError.mock.callCount(), 1);
    program.fatalError.mock.restore();
    program.reset();
  });
});

describe('Passing a known short option', () => {

  it(`should succeed`, () => {
    program
      .reset()
      .option('-t <time-in-secs>')
      .action(() => {});

    program.fatalError = mock.fn()
    program.parse(makeArgv(['-t', '278']));
    equal(program.fatalError.mock.callCount(), 0);
    program.fatalError.mock.restore();
    program.reset();
  });
});

describe('Setting up a required option (long)', () => {

  it(`should throw MissingOptionError if not passed`, () => {
    program
      .command('foo')
      .option('-t, --time <time-in-secs>', 'my option', null, null, true)
      .action(() => {});

    program.fatalError = mock.fn((err) => {
      equal(err.name, 'MissingOptionError');
    });
    program.parse(makeArgv('foo'));
    equal(program.fatalError.mock.callCount(), 1);
    program.fatalError.mock.restore();
    program.reset();
  });
});

describe('Setting up a required option (short)', () => {

  it(`should throw MissingOptionError if not passed`, () => {
    program
      .command('foo')
      .option('-t <time-in-secs>', 'my option', null, null, true)
      .action(() => {});

    program.fatalError = mock.fn((err) => {
      equal(err.name, 'MissingOptionError');
    });
    program.parse(makeArgv('foo'));
    equal(program.fatalError.mock.callCount(), 1);
    program.fatalError.mock.restore();
    program.reset();
  });
});

describe('Setting up a just one short option', () => {

  it(`should work`, () => {


    const action = mock.fn();
    program
      .command('foo')
      .option('-t <time-in-secs>')
      .action(action);

    program.parse(makeArgv(['foo', '-t', '2']));
    equal(action.mock.callCount(), 1);
    deepEqual(action.mock.calls[0].arguments[1], {t:'2'});
    program.reset();
  });
});


describe('Setting up a option synopsis containing an error', () => {

  it(`should throw OptionSyntaxError`, () => {

    program.fatalError = mock.fn((err) => {
      equal(err.name, 'OptionSyntaxError');
    });

    program
      .command('foo')
      .option('-t <time-in-secs> foo', 'my option', null, null, true)
      .action(() => {});

    equal(program.fatalError.mock.callCount(), 1);
    program.fatalError.mock.restore();
    program.reset();
  });
});
