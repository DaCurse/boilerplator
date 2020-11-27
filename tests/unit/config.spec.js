const fs = require('fs');
const { Volume } = require('memfs');
const { join } = require('path');
const ConfigNotFound = require('../../src/errors/ConfigNotFound');
const {
  loadConfig,
  defaultFilename,
  defaultConfig,
} = require('../../src/util/config');

jest.mock('fs');

describe('util/config.js', () => {
  const configDir = '/config';
  const configPath = join(configDir, defaultFilename);

  afterEach(() => {
    fs.reset();
  });

  describe('no config file present', () => {
    it('should throw an error', () => {
      fs.use(Volume.fromJSON({}, '/'));
      expect(loadConfig.bind(null, configDir)).toThrow(ConfigNotFound);
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
    it('should return the correct config', () => {
      const configMock = { foo: 'bar' };
      const vol = Volume.fromJSON(
        {
          'config.json': JSON.stringify(configMock),
        },
        '/'
      );
      fs.use(vol);

      const { config } = loadConfig('/config.json');
      expect(config).toEqual(configMock);
    });
  });
});
