const fs = require('fs');
const { Volume } = require('memfs');
const { join } = require('path');
const { isDirectorySync, isFileSync } = require('path-type');
const {
  loadConfig,
  defaultFilename,
  defaultConfig,
} = require('../../src/util/config');

jest.mock('fs', () => {
  const fs = jest.requireActual('fs');
  const { default: unionfs } = require('unionfs');

  unionfs.reset = () => {
    unionfs.fss = [fs];
  };

  return unionfs.use(fs);
});

describe('util/config.js', () => {
  const configDir = '/config';
  const configPath = join(configDir, defaultFilename);

  afterEach(() => {
    fs.reset();
  });

  describe('no config and no config directory present', () => {
    beforeAll(() => {
      fs.use(Volume.fromJSON({}, '/'));
      this.config = loadConfig(configDir).config;
    });

    it('should create config directory and default config file', () => {
      expect(isDirectorySync(configDir)).toBe(true);
      expect(isFileSync(configPath)).toBe(true);
    });

    it('should return default config', () => {
      expect(this.config).toEqual(defaultConfig);
    });
  });

  describe('valid config file present', () => {
    beforeAll(() => {
      this.configMock = {
        templateDirectory: '/template-directory',
        defaultPlaceholders: { foo: 'bar' },
        gitOptions: { createRepository: true },
      };
      const vol = Volume.fromJSON(
        {
          [configPath]: JSON.stringify(this.configMock),
        },
        '/'
      );
      fs.use(vol);

      this.config = loadConfig(configDir).config;
    });

    it('should return templateDirectory from config', () => {
      expect(this.config.templateDirectory).toBe(
        this.configMock.templateDirectory
      );
    });

    it('should merge default options which are not present', () => {
      expect(this.config.placeholderRegex).toEqual(
        defaultConfig.placeholderRegex
      );
    });

    it('should not override a default option that already exists', () => {
      expect(this.config.defaultPlaceholders).not.toEqual(
        defaultConfig.defaultPlaceholders
      );
    });
  });

  describe('direct config file path provided', () => {
    beforeAll(() => {
      this.configMock = { foo: 'bar' };
      const vol = Volume.fromJSON(
        {
          'config.json': JSON.stringify(this.configMock),
        },
        '/'
      );
      fs.use(vol);

      this.config = loadConfig('/config.json').config;
    });

    it('should return the correct config', () => {
      expect(this.config).toEqual(this.configMock);
    });
  });
});