import should from 'should';

import { Program } from '../lib/program.js';

describe("import('caporal')", () => {
  it(`should return {new Program()}`, () => {
    const caporal = import('../index.js');
    should(caporal).be.instanceOf(Program);
  });
});


