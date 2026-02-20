import path from 'node:path';
import parseArgs from 'micromist';

import { GetterSetter, isPromise } from './utils.js';
import { Command } from './command.js';
import { Help } from './help.js';
import * as constants from './constants.js';

const re = /([0-9]+|([A-Z][a-z]+)|[a-z]+|([A-Z]+)(?![a-z]))/g
const kebabCase = str =>
  (String(str ?? '').match(re) || []).map(x => x.toLowerCase()).join('-')


class Program extends GetterSetter {

  constructor() {
    super();
    this._commands = [];
    this._helper = new Help(this);
    this.version = this.makeGetterSetter('version');
    this.name = this.makeGetterSetter('name');
    this.description = this.makeGetterSetter('description');
    this.bin = this.makeGetterSetter('bin');
    this._bin = path.basename(process.argv[1] || 'caporal');
    this._supportedShell = ['bash', 'zsh', 'fish'];
    this._defaultCommand = null;
  }

  /**
   *
   * @param {string} cmdStr
   * @returns {string}
   */
  _help(cmdStr) {
    const cmd = this._commands.filter(c => (c.name() === cmdStr || c.getAlias() === cmdStr))[0];
    const help = this._helper.get(cmd);
    console.log(help);
    return help;
  }

  /**
   * Add a global help for your program
   *
   * @param {string} help - Help string
   * @param {{}} options
   * @returns {Program}
   */
  help(help, options) {
    this._helper._addCustomHelp(help, options);
    return this;
  }

  /**
   * @private
   * @returns {[]}
   */
  getCommands() {
    return this._commands;
  }

  /**
   * Reset all commands
   *
   * @private
   * @returns {Program}
   */
  reset() {
    this._commands = [];
    this._defaultCommand = null;
    return this;
  }

  /**
   *
   * @param {string} synospis
   * @param {string} description
   * @returns {Command}
   */
  command(synospis, description) {
    const cmd = new Command(synospis, description, this);
    this._commands.push(cmd);
    return cmd;
  }

  /**
   * @param {Error} errObj - Error object
   * @private
   */
  fatalError(errObj) {
    if(this.verbose) {
      console.error("\n" + errObj.stack);
    } else {
      console.error("\n" + errObj.message);
    }
    process.exit(2);
  }

  /**
   * Find the command to run, based on args, performs checks, then run it
   *
   * @param {Array} args - Command arguments
   * @param {Object} options - Options passed
   * @returns {*}
   * @private
   */
  _run(args, options) {

    if (args[0] === 'help') {
      this._help(args.slice(1).join(' '));
      return process.exit(0);
    }

    let argsCopy = args.slice();
    const commandArr = [];
    /**
     * @type {Command}
     */
    let cmd;

    while(!cmd && argsCopy.length > 0) {
      commandArr.push(argsCopy.shift());
      const cmdStr = commandArr.join(' ');
      cmd = this._commands.filter(c => (c.name() === cmdStr || c.getAlias() === cmdStr))[0];
    }

    if (options.V || options.version) {
      console.log(this.version());
      return process.exit(0);
    }

    if(!cmd) {
      let _filter = this._commands.filter(c => c._default === true);
      if(_filter.length > 0) {
        cmd = _filter[0];
        argsCopy = args.slice();
      }
    }

    if (!cmd && this._getDefaultCommand()) {
      cmd = this._getDefaultCommand();
      argsCopy = args.slice();
    }

    if (!cmd) {
      this._help(args.join(' '));
      return process.exit(1);
    }

    if (options.help || options.h) {
      this._help(args.join(' '));
      return process.exit(0);
    }

    let validated;

    try {
      validated = cmd._validateCall(argsCopy, options);
      if (isPromise(validated)) {
        return validated
          .then(v => cmd._run(v.args, v.options))
          .catch(err => {
            throw this.fatalError(err);
          })
      }
    } catch(err) {
      return this.fatalError(err);
    }

    return cmd._run(validated.args, validated.options);
  }


  /**
   * Sets a unique action for the program
   *
   * @param {Function} action - Action to run
   * @returns {Program}
   */
  action(action) {
    this._getDefaultCommand(true).action(action);
    return this;
  }

  /**
   * Set an option on the default command
   *
   * @param {string} synopsis - Option synopsis like '-f, --force', or '-f, --file <file>'
   * @param {string} description - Option description
   * @param {string|RegExp|Function|Number|Array} [validator] - Option validator, used for checking or casting
   * @param {*} [defaultValue] - Default value
   * @param {Boolean} [required] - Is the option itself required
   * @returns {Program}
   */
  // oxlint-disable-next-line no-unused-vars
  option(synopsis, description, validator, defaultValue, required) {
    const cmd = this._getDefaultCommand(true);
    let args = Array.prototype.slice.call(arguments);
    cmd.option(...args);
    return this;
  }

  /**
   * Add an argument to the default command
   *
   * @param {string} synopsis - Argument synopsis like `<my-argument>` or `[my-argument]`.
   * Angled brackets (e.g. `<item>`) indicate required input. Square brackets (e.g. `[env]`) indicate optional input.
   * @param {string} description - Option description
   * @param {string|RegExp|Function|Number|Array} [validator] - Option validator, used for checking or casting
   * @param {*} [defaultValue] - Default value
   * @public
   * @returns {Command}
   */
  // oxlint-disable-next-line no-unused-vars
  argument(synopsis, description, validator, defaultValue) {
    const cmd = this._getDefaultCommand(true);
    let args = Array.prototype.slice.call(arguments);
    cmd.argument(...args);
    return cmd;
  }

  /**
   *
   * @param {boolean} create
   * @returns {Command}
   * @private
   */
  _getDefaultCommand(create) {
    if (!this._defaultCommand && create) {
      this._defaultCommand = this.command('_default', 'Default command');
    }
    return this._defaultCommand;
  }

  /**
   * @private
   * @param {{_: Array}} args
   * @param {*[]} argv
   * @returns {*}
   */
  _handleCompletionCommand(args, argv) {}

  /**
   * Parse command line arguments.
   * @public
   * @param {Array} [argv] argv
   * @returns {*}
   */
  parse(argv) {
    const argvSlice = argv.slice(2);
    let cmd = this._commands.filter(c => (c.name() === argvSlice[0] || c.getAlias() === argvSlice[0]))[0];
    if (!cmd)
      cmd = this._getDefaultCommand(false);
    const args = parseArgs(argv, cmd ? cmd.parseArgsOpts : {});
    let options = { ...args};
    delete options._;

    if (args._[0] === 'completion') {
      return this._handleCompletionCommand(args, argvSlice);
    }

    return this._run(args._, options);
  }

  /**
   * Execute input command with given arguments & options
   * @param {{}} options
   * @param {string[]} args
   * @public
   * @returns {*}
   */
  exec(args, options) {
    const kebabOptions = Object.keys(options).reduce((result, key) => {
      result[kebabCase(key)] = options[key];
      return result;
    }, {});
    return this._run(args, kebabOptions);
  }
}

Program.prototype.INT = constants.INT;
Program.prototype.INTEGER = constants.INTEGER;
Program.prototype.FLOAT = constants.FLOAT;
Program.prototype.BOOL = constants.BOOL;
Program.prototype.BOOLEAN = constants.BOOLEAN;
Program.prototype.STRING = constants.STRING;
Program.prototype.ARRAY = constants.ARRAY;
Program.prototype.LIST = constants.LIST;
Program.prototype.REPEATABLE = constants.REPEATABLE;
Program.prototype.REQUIRED = constants.REQUIRED;

export { Program };
