import { describe, it } from 'node:test';
import { equal } from 'node:assert/strict';

import caporal from '../index.js';
import { Program } from '../lib/program.js';

describe("import('caporal')", () => {
  it(`should return {new Program()}`, () => {
    equal(caporal instanceof Program, true);
  });
});
