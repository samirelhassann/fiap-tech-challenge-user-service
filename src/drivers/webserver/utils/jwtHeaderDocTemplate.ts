export const jwtHeaderDocsSchemaTemplate = {
  type: "object",
  properties: {
    Authorization: {
      type: "string",
      description: "Bearer token",
    },
  },
};
