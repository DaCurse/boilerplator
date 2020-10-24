const applyPlaceholders = require('../../src/util/apply-placeholders');

describe('util/apply-placeholders.js', () => {
  const placeholderRegex = /{{([\w-_]+)}}/g;

  it('should apply placeholders', () => {
    const str = '{{greeting}} {{subject}}!';
    const placeholders = new Map(
      Object.entries({ greeting: 'Hello', subject: 'World' })
    );
    const output = applyPlaceholders(placeholders, placeholderRegex, str);

    expect(output).toBe('Hello World!');
  });

  it('should warn about missing placeholder', () => {
    console.warn = jest.fn();
    const str = '{{greeting}}';
    const placeholders = new Map();
    applyPlaceholders(placeholders, placeholderRegex, str);

    expect(console.warn).toBeCalled();
  });
});
