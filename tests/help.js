import { describe, it } from 'node:test';
import { equal } from 'node:assert/strict';
import sinon from 'sinon';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

const program = new Program();

program
  .version('1.0.0');


describe('Calling {program} help', function() {

  it(`should output global help for single command program`, function() {
    program
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv('help'));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    help.restore();
    exit.restore();
    program.reset();
  });

  it(`should output global help for multiple commands program`, function() {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .action(function() {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(function() {})


    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv('help'));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    help.restore();
    exit.restore();
    program.reset();
  });

  it(`should output command-specific help for multiple commands program`, function() {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {})


    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['help', 'command1']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    exit.restore();
    help.restore();
    program.reset();
  });


  it(`should output command-specific help for single command program`, function() {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['help', 'command1']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    help.restore();
    exit.restore();
    program.reset();
  });


  it(`should output custom global help for single command program`, function() {
    const customHelp = 'CUSTOM_HELP';
    program
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv('help'));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    equal(program._help().includes(customHelp), true);
    help.restore();
    exit.restore();
    program.reset();
  });

  it(`should output specific command help for a program`, function() {
    const customHelp = 'CUSTOM_HELP';
    program
      .description('my desc')
      .command('command1', '1st command')
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['help', 'command1']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    equal(program._help().includes(customHelp), true);
    help.restore();
    exit.restore();
    program.reset();
  });

});




describe('Calling {program} --help', function() {

  it(`should output global help for single command program`, function() {
    program
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['--help']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    help.restore();
    exit.restore();
    program.reset();
  });

  it(`should output global help for multiple commands program`, function() {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .action(function() {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(function() {})


    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['--help']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    help.restore();
    exit.restore();
    program.reset();
  });

  it(`should output command-specific help for multiple commands program`, function() {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {})


    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['--help', 'command1']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    exit.restore();
    help.restore();
    program.reset();
  });


  it(`should output command-specific help for single command program`, function() {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['--help', 'command1']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    help.restore();
    exit.restore();
    program.reset();
  });


  it(`should output custom global help for single command program`, function() {
    const customHelp = 'CUSTOM_HELP';
    program
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['--help']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    equal(program._help().includes(customHelp), true);
    help.restore();
    exit.restore();
    program.reset();
  });

  it(`should output specific command help for a program`, function() {
    const customHelp = 'CUSTOM_HELP';
    program
      .description('my desc')
      .command('command1', '1st command')
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['--help', 'command1']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    equal(program._help().includes(customHelp), true);
    help.restore();
    exit.restore();
    program.reset();
  });

});





describe('Calling {program} -h', function() {

  it(`should output global help for single command program`, function() {
    program
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['-h']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    help.restore();
    exit.restore();
    program.reset();
  });

  it(`should output global help for multiple commands program`, function() {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .action(function() {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(function() {})


    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['-h']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    help.restore();
    exit.restore();
    program.reset();
  });

  it(`should output command-specific help for multiple commands program`, function() {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {})
      .command('command2', '2nd command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {})


    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['-h', 'command1']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    exit.restore();
    help.restore();
    program.reset();
  });


  it(`should output command-specific help for single command program`, function() {
    program
      .description('my desc')
      .command('command1', '1st command')
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['-h', 'command1']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    help.restore();
    exit.restore();
    program.reset();
  });


  it(`should output custom global help for single command program`, function() {
    const customHelp = 'CUSTOM_HELP';
    program
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg')
      .option('-f, --foo', 'Foo option')
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['-h']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    equal(program._help().includes(customHelp), true);
    help.restore();
    exit.restore();
    program.reset();
  });

  it(`should output specific command help for a program`, function() {
    const customHelp = 'CUSTOM_HELP';
    program
      .description('my desc')
      .command('command1', '1st command')
      .help(customHelp)
      .argument('<required>', 'Required arg')
      .argument('[optional]', 'Optional arg', null, 2)
      .option('-f, --foo', 'Foo option')
      .option('-b, --bar', 'Bar option', null, 1, true)
      .action(function() {});

    const help = sinon.spy(program, "_help");
    const exit = sinon.stub(process, "exit");
    program.parse(makeArgv(['-h', 'command1']));
    equal(help.callCount, 1);
    equal(exit.callCount, 1);
    equal(program._help().includes(customHelp), true);
    help.restore();
    exit.restore();
    program.reset();
  });

});
