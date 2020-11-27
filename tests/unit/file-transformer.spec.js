const { PassThrough } = require('stream');
const applyPlaceholders = require('../../src/util/apply-placeholders');
const fileTransformer = require('../../src/util/file-transformer');

describe('util/file-transformer.js', () => {
  it('should transform input and apply placeholders', (done) => {
    const mockReadable = new PassThrough();
    const mockWritable = new PassThrough();
    const placeholders = new Map(Object.entries({ foo: 'bar' }));
    const placeholderRegex = /{(\w+)}/;
    const input = 'hello {foo} world';
    const expectedOutput = applyPlaceholders(
      placeholders,
      placeholderRegex,
      input
    );
    const transform = fileTransformer(placeholders, placeholderRegex)();

    mockReadable.on('data', (data) => {
      expect(data.toString()).toBe(input);
    });
    mockWritable.on('data', (data) => {
      expect(data.toString()).toBe(expectedOutput);
    });
    mockWritable.on('end', () => {
      done();
    });

    mockReadable.pipe(transform).pipe(mockWritable);
    mockReadable.emit('data', input);
    mockReadable.end();
    mockReadable.destroy();
  });
});
