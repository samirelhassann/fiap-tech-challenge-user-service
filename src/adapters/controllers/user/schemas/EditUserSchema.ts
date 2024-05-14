import { z } from "zod";

import { convertZodSchemaToDocsTemplate } from "@/drivers/webserver/utils/convertZodSchemaToDocsTemplate";
import { generateSchemaFromSampleObject } from "@/drivers/webserver/utils/generateSchemaFromSampleObject";

import { EditUserViewModel } from "../viewModels/EditUserViewModel";
import { tag } from "./constants";

export const editUserPathParametersSchema = z.object({
  id: z.string(),
});

export const editUserPayloadSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

export const editUserHeadersSchema = z.object({
  authorization: z.string(),
});

const responseExample: EditUserViewModel = {
  id: "123",
  name: "John",
  email: "john.doe@test.com",
  taxVat: "456",
  createdAt: "2023-10-26",
  updatedAt: "2023-10-27",
};

export const editUserDocSchema = {
  tags: [tag],
  description: `Edit ${tag}`,
  params: convertZodSchemaToDocsTemplate({
    schema: editUserPathParametersSchema,
  }),
  body: convertZodSchemaToDocsTemplate({
    schema: editUserPayloadSchema,
  }),
  response: {
    200: generateSchemaFromSampleObject(responseExample),
  },
};
