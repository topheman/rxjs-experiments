/* eslint-disable no-unused-expressions */

import { compilePattern, normalizeRoutes, compileMatchMount } from '../utils';

const expect = require('chai').expect;

describe('micro-router', () => {
  describe('compilePattern', () => {
    describe('Match all pattern: *', () => {
      const matcher = compilePattern('*');
      it('should match /toto', () => {
        expect(matcher('/toto')).to.eql({});
      });
      it('should match anything', () => {
        expect(matcher('anything')).to.eql({});
      });
    });
    describe('RegExp pattern: /^\\/posts\\/(\\w+)\\/(\\w+)\\/edit$/', () => {
      const matcher = compilePattern(/^\/posts\/(\w+)\/(\w+)\/edit$/);
      it('should match /posts/foo/bar/edit', () => {
        expect(matcher('/posts/foo/bar/edit')).to.eql({});
      });
      it('should NOT match /posts/foo/bar/editNO', () => {
        expect(matcher('/posts/foo/bar/editNO')).to.be.false;
      });
      it('should NOT match /posts/foo/bar/edit/NO', () => {
        expect(matcher('/posts/foo/bar/editNO')).to.be.false;
      });
      it('should NOT match /posts/foo/bar', () => {
        expect(matcher('/posts/foo/bar')).to.be.false;
      });
    });
    describe('Params pattern: /repos/:owner/:name/edit', () => {
      const matcher = compilePattern('/repos/:owner/:name/edit');
      it('should match /repos/topheman/rsjs-experiments/edit', () => {
        expect(matcher('/repos/topheman/rsjs-experiments/edit')).to.be.ok;
      });
      it('should match the params from /repos/topheman/rsjs-experiments/edit', () => {
        expect(matcher('/repos/topheman/rxjs-experiments/edit')).to.deep.equal({
          owner: 'topheman',
          name: 'rxjs-experiments'
        });
      });
      it('should NOT match /repo/reactjs/redux', () => {
        expect(matcher('/repo/reactjs/redux')).to.be.false;
      });
      it('should NOT match /repo/reactjs/redux/display', () => {
        expect(matcher('/repo/reactjs/redux/display')).to.be.false;
      });
      it('should NOT match /repo/reactjs', () => {
        expect(matcher('/repo/reactjs')).to.be.false;
      });
      it('should NOT match /repo', () => {
        expect(matcher('/repo/reactjs')).to.be.false;
      });
    });
    describe('Plain string patter: /hello/world', () => {
      const matcher = compilePattern('/hello/world');
      it('should match /hello/world', () => {
        expect(matcher('/hello/world')).to.eql({});
      });
      it('should NOT match /hello/world/NOT', () => {
        expect(matcher('/hello/world/NOT')).to.be.false;
      });
      it('should NOT match /hello', () => {
        expect(matcher('/hello')).to.be.false;
      });
    });
  });
  describe('normalizeRoutes', () => {
    describe('sanity checks', () => {
      it('should NOT throw when pattern and handler attribute are present', () => {
        expect(() => normalizeRoutes([
          { pattern: 'foo', handler: () => ({}) }
        ])).to.not.throw();
      });
      it('should throw when handler attribute is missing', () => {
        expect(() => normalizeRoutes([
          { pattern: 'foo' }
        ])).to.throw();
      });
      it('should throw when pattern attribute is missing', () => {
        expect(() => normalizeRoutes([
          { handler: () => ({}) }
        ])).to.throw();
      });
      it('should throw if resolve attribute is not a promise', () => {
        expect(() => normalizeRoutes([
          { pattern: 'foo', handler: () => ({}), resolve: {} }
        ])).to.throw();
      });
      it('should NOT throw if resolve attribute is a promise', () => {
        expect(() => normalizeRoutes([
          { pattern: 'foo', handler: () => ({}), resolve: { then: () => ({}) } }
        ])).to.not.throw();
      });
    });
    describe('mapping - normalizeRoutes(routes)', () => {
      const routes = [
        { pattern: '/hello/world', handler: () => ({}) },
        { pattern: /^\/hie\/universe/, handler: () => ({}) },
        { pattern: '/hello/:name', handler: () => ({}) },
        { pattern: '*', handler: () => ({}) }
      ];
      it('should return a array', () => {
        expect(normalizeRoutes(routes)).to.have.lengthOf(4);
      });
      it('should return a populated array', () => {
        const normalizedRoutes = normalizeRoutes(routes);
        expect(normalizedRoutes[0]).to.contain.all.keys(['matcher', 'handler', 'resolve']);
        expect(normalizedRoutes[1]).to.contain.all.keys(['matcher', 'handler', 'resolve']);
        expect(normalizedRoutes[2]).to.contain.all.keys(['matcher', 'handler', 'resolve']);
        expect(normalizedRoutes[3]).to.contain.all.keys(['matcher', 'handler', 'resolve']);
      });
    });
  });
  describe('compileMatchMount', () => {
    const routes = [
      { pattern: '/hello/world', handler: () => ({}) },
      { pattern: /^\/hie\/universe/, handler: () => ({}) },
      { pattern: '/hello/:name', handler: () => ({}) },
      { pattern: '*', handler: () => ({}) }
    ];
    const matchMount = compileMatchMount(normalizeRoutes(routes));
    it('should match /hello/world', () => {
      expect(matchMount('/hello/world')).to.contain.all.keys(['params', 'handler', 'resolve']);
      expect(matchMount('/hello/world').params).to.eql({});
    });
    it('should match /hie/universe', () => {
      expect(matchMount('/hie/universe')).to.contain.all.keys(['params', 'handler', 'resolve']);
      expect(matchMount('/hie/universe').params).to.eql({});
    });
    it('should match /hello/topheman', () => {
      expect(matchMount('/hello/topheman')).to.contain.all.keys(['params', 'handler', 'resolve']);
      expect(matchMount('/hello/topheman').params).to.eql({ name: 'topheman' });
    });
    it('should match /whatever', () => {
      expect(matchMount('/whatever')).to.contain.all.keys(['params', 'handler', 'resolve']);
      expect(matchMount('/whatever').params).to.eql({});
    });
  });
});
