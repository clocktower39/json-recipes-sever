const Ajv = require('ajv');

const ajvInstance = new Ajv({ allErrors: true });

module.exports = ajvInstance;