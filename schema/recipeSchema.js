const ajvInstance = require("./ajv-instance");

const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    ingredients: {
      type: "array",
      items: [
        {
          type: "string",
        },
      ],
    },
    instructions: {
      type: "array",
      items: [
        {
          type: "string",
        },
      ],
    },
  },
  additionalProperties: false,
  required: ["name", "ingredients", "instructions"],
};

module.exports = ajvInstance.compile(schema);
