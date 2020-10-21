const { join } = require('path');
const configDir = require('../../src/util/config-dir');

describe('util/config-dir.js', () => {
  const originalPlatform = process.platform;
  const mockPlatform = (value) =>
    Object.defineProperty(process, 'platform', { value });

  afterAll(() => mockPlatform(originalPlatform));

  it('should return correct directory for Windows', () => {
    mockPlatform('win32');
    expect(configDir()).toBe(process.env.APPDATA);
  });

  it('should return correct directory for macOS', () => {
    mockPlatform('darwin');
    expect(configDir()).toBe(
      join(process.env.HOME, '/Library/Application Support')
    );
  });

  it('should return correct directory for Linux', () => {
    mockPlatform('linux');
    // Reversing the comparison to match if result is any of the values
    expect([
      process.env.XDG_CONFIG_HOME,
      join(process.env.HOME, '.config'),
    ]).toContain(configDir());
  });

  it('should return null if platform is invalid', () => {
    expect(configDir('invalid platform')).toBeNull();
  });
});
