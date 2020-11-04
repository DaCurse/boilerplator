const { join } = require('path');
const configDir = require('../../src/util/config-dir');
const { name } = require('../../package.json');

describe('util/config-dir.js', () => {
  const originalPlatform = process.platform;
  const mockPlatform = (value) =>
    Object.defineProperty(process, 'platform', { value });

  beforeAll(() => {
    Object.assign(process.env, {
      APPDATA: '/appdata',
      HOME: '/home',
    });
  });

  afterAll(() => mockPlatform(originalPlatform));

  it('should return correct directory for Windows', () => {
    mockPlatform('win32');
    expect(configDir()).toBe(join(process.env.APPDATA, name));
  });

  it('should return correct directory for macOS', () => {
    mockPlatform('darwin');
    expect(configDir()).toBe(
      join(process.env.HOME, '/Library/Application Support', name)
    );
  });

  describe('Linux', () => {
    beforeAll(() => {
      mockPlatform('linux');
      process.env.XDG_CONFIG_HOME = '/xdg';
    });

    afterEach(() => {
      delete process.env.XDG_CONFIG_HOME;
    });

    it('should return path with $XDG_CONFIG_HOME', () => {
      expect(configDir()).toEqual(join(process.env.XDG_CONFIG_HOME, name));
    });

    it('should return path with $HOME', () => {
      expect(configDir()).toEqual(join(process.env.HOME, '.config', name));
    });
  });

  it('should return null if platform is invalid', () => {
    expect(configDir(name, 'invalid platform')).toBeFalsy();
  });
});
