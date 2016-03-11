/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;

import { getMatcherFromPattern } from '../utils';

describe('micro-router', () => {
  describe('pattern matching', () => {
    describe('*', () => {
      const matcher = getMatcherFromPattern('*');
      it('should match /toto', () => {
        expect(matcher('/toto')).to.be.true;
      });
      it('should match anything', () => {
        expect(matcher('anything')).to.be.true;
      });
    });
  });
});
