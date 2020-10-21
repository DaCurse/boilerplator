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

  const consoleOutput = [];
  const originalWarn = console.warn;
  const mockedWarn = (output) => consoleOutput.push(output);

  beforeEach(() => (console.warn = mockedWarn));
  afterEach(() => (console.warn = originalWarn));

  it('should warn about missing placeholder', () => {
    const str = '{{greeting}}';
    const placeholders = new Map();
    applyPlaceholders(placeholders, placeholderRegex, str);

    expect(consoleOutput).toEqual(
      expect.arrayContaining([
        expect.stringContaining('No value provided for placeholder'),
      ])
    );
  });
});
