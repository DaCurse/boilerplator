module.exports = class TemplateDirNotFound extends Error {
  constructor(message = 'Template directory specified in config not found.') {
    super(message);
    this.name = 'TemplateDirNotFoundError';
  }
};
