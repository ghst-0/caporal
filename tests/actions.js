import { equal } from 'node:assert/strict';
import sinon from 'sinon';

import { Program } from '../lib/program.js';
import { makeArgv } from './utils/make-argv.js';

describe('Setting up no action()', () => {

  it(`should throw NoActionError`, () => {

    const program = new Program();

    program
      .version('1.0.0')
      .command('foo', 'My foo');

    const error = sinon.stub(program, "fatalError", function(err) {
      equal(err.name, 'NoActionError');
    });

    program.parse(makeArgv('foo'));

    const count = error.callCount;
    error.restore();
    equal(count, 1);
    program.reset();
  });

});


describe('Setting up a sync action', () => {

  it(`should call this action`, () => {

    const program = new Program();
    const action = sinon.spy();

    program
      .version('1.0.0')
      .command('foo', 'My foo')
      .action(action);

    program.parse(makeArgv('foo'));

    equal(action.callCount, 1);

    program.reset();
  });

});


describe('Setting up a async action', () => {

  it(`should succeed for a resolved promise`, () => {

    const program = new Program();
    const action = function() {
      return Promise.resolve('foo')
    };
    const stub = sinon.spy(action);

    program
      .version('1.0.0')
      .command('foo', 'My foo')
      .action(stub);

    program.parse(makeArgv('foo'));

    equal(stub.callCount, 1);
    program.reset();

  });

  it(`should fatalError() for a rejected promise (error string)`, (done) => {

    const program = new Program();
    const action = function() {
      return Promise.reject('Failed!')
    };
    const stub = sinon.spy(action);
    const fatalError = sinon.stub(program, "fatalError");

    program
      .version('1.0.0')
      .command('foo', 'My foo')
      .action(stub);

    program.parse(makeArgv('foo')).then(() => {}).catch(() => {}).then(() => {
      equal(stub.callCount, 1);
      equal(fatalError.callCount, 1);
      done()
    })

  });
  it(`should fatalError() for a rejected promise (error object)`, (done) => {

    const program = new Program();
    const action = function() {
      return Promise.reject(new Error('Failed!'))
    };
    const stub = sinon.spy(action);
    const fatalError = sinon.stub(program, "fatalError");

    program
      .version('1.0.0')
      .command('foo', 'My foo')
      .action(stub);

    program.parse(makeArgv('foo')).then(() => {}).catch(() => {}).then(() => {
      equal(stub.callCount, 1);
      equal(fatalError.callCount, 1);
      done()
    });

  });

});
