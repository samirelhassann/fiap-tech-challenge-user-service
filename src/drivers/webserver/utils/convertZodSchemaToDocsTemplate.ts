/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable guard-for-in */

import { z } from "zod";

/* eslint-disable no-restricted-syntax */
function getZodSchemaFormated(string: string) {
  const stringFormated = string.replace("Zod", "");
  return stringFormated.charAt(0).toLowerCase() + stringFormated.slice(1);
}

export function convertZodSchemaToDocsTemplate({
  schema,
  required = [],
}: {
  schema: z.ZodObject<any>;
  required?: string[];
}) {
  const properties: Record<string, { type: string }> = {};

  for (const key in schema.shape) {
    const typeName = schema.shape[key]._def.innerType
      ? schema.shape[key]._def.innerType._def.typeName
      : schema.shape[key]._def.typeName;

    properties[key] = {
      type: getZodSchemaFormated(typeName),
    };
  }

  return {
    type: "object",
    required,
    properties,
  };
}
