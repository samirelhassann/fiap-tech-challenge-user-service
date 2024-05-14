/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

type SchemaType = "object" | "array" | "string" | "number" | "boolean";

type SchemaProperty = {
  type: SchemaType;
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
};

export function generateSchemaFromSampleObject(sample: any): SchemaProperty {
  if (typeof sample === "string") return { type: "string" };
  if (typeof sample === "number") return { type: "number" };
  if (typeof sample === "boolean") return { type: "boolean" };

  if (Array.isArray(sample) && sample.length) {
    return {
      type: "array",
      items: generateSchemaFromSampleObject(sample[0]),
    };
  }

  const properties: Record<string, SchemaProperty> = {};
  for (const key in sample) {
    properties[key] = generateSchemaFromSampleObject(sample[key]);
  }

  return {
    type: "object",
    properties,
  };
}
