const parseArgs = require('../../src/util/parse-args');

describe('util/parse-args.js', () => {
  it('should parse args and return a Map with them', () => {
    const args = ['arg1=foo', 'arg2=bar'];

    expect(parseArgs(args)).toEqual(
      new Map(Object.entries({ arg1: 'foo', arg2: 'bar' }))
    );
  });

  it('should parse args and return a Map with them and default placeholders', () => {
    const args = ['arg1=baz'];
    const defaultPlaceholders = { arg1: 'foo', arg2: 'bar' };

    expect(parseArgs(args, defaultPlaceholders)).toEqual(
      new Map(Object.entries({ arg1: 'baz', arg2: 'bar' }))
    );
  });

  it('should parse args with multiple delimiters without error', () => {
    const args = ['arg1===='];
    expect(parseArgs(args)).toEqual(new Map(Object.entries({ arg1: '===' })));
  });

  it('should parse args and ignore invalid ones', () => {
    const args = ['arg1=foo', 'invalid', 'arg'];
    expect(parseArgs(args)).toEqual(new Map(Object.entries({ arg1: 'foo' })));
  });
});
