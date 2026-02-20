import { describe, it, mock } from 'node:test';
import { equal } from 'node:assert/strict';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

const program = new Program();

program
  .version('1.0.0');

describe('Calling {program} help', () => {

  it(`should output global help for single command program`, () => {
    program
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv('help'));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program.reset();
  });

  it(`should output global help for multiple commands program`, () => {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .action(() => {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(() => {})

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv('help'));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output command-specific help for multiple commands program`, () => {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {})

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['help', 'command1']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output command-specific help for single command program`, () => {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['help', 'command1']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output custom global help for single command program`, () => {
    const customHelp = 'CUSTOM_HELP';
    program
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv('help'));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    equal(program._help().includes(customHelp), true);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output specific command help for a program`, () => {
    const customHelp = 'CUSTOM_HELP';
    program
      .description('my desc')
      .command('command1', '1st command')
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['help', 'command1']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    equal(program._help().includes(customHelp), true);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });
});

describe('Calling {program} --help', () => {

  it(`should output global help for single command program`, () => {
    program
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['--help']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output global help for multiple commands program`, () => {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .action(() => {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(() => {})

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['--help']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output command-specific help for multiple commands program`, () => {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {})

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['--help', 'command1']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output command-specific help for single command program`, () => {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['--help', 'command1']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output custom global help for single command program`, () => {
    const customHelp = 'CUSTOM_HELP';
    program
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['--help']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    equal(program._help().includes(customHelp), true);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output specific command help for a program`, () => {
    const customHelp = 'CUSTOM_HELP';
    program
      .description('my desc')
      .command('command1', '1st command')
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['--help', 'command1']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    equal(program._help().includes(customHelp), true);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });
});

describe('Calling {program} -h', () => {

  it(`should output global help for single command program`, () => {
    program
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['-h']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output global help for multiple commands program`, () => {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .action(() => {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(() => {})

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['-h']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output command-specific help for multiple commands program`, () => {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {})


    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['-h', 'command1']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output command-specific help for single command program`, () => {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['-h', 'command1']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output custom global help for single command program`, () => {
    const customHelp = 'CUSTOM_HELP';
    program
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['-h']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    equal(program._help().includes(customHelp), true);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });

  it(`should output specific command help for a program`, () => {
    const customHelp = 'CUSTOM_HELP';
    program
      .description('my desc')
      .command('command1', '1st command')
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(() => {});

    mock.method(program, '_help');
    process.exit = mock.fn();
    program.parse(makeArgv(['-h', 'command1']));
    equal(program._help.mock.callCount(), 1);
    equal(process.exit.mock.callCount(), 1);
    equal(program._help().includes(customHelp), true);
    program._help.mock.restore();
    process.exit.mock.restore();
    program.reset();
  });
});
