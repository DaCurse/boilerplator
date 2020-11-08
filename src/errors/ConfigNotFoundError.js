module.exports = class ConfigNotFoundError extends Error {
  constructor(
    message = "Couldn't find config file! Please run 'boil init' to create one."
  ) {
    super(message);
    this.name = 'ConfigNotFoundError';
  }
};
