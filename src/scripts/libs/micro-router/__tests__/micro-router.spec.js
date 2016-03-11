/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;

import { compilePattern } from '../utils';

describe('micro-router', () => {
  describe('pattern matching', () => {
    describe('*', () => {
      const matcher = compilePattern('*');
      it('should match /toto', () => {
        expect(matcher('/toto')).to.be.truthy;
      });
      it('should match anything', () => {
        expect(matcher('anything')).to.be.truthy;
      });
    });
  });
});
