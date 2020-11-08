module.exports = class TemplateDirNotFoundError extends Error {
  constructor(message = 'Template directory specified in config not found.') {
    super(message);
    this.name = 'TemplateDirNotFoundError';
  }
};
