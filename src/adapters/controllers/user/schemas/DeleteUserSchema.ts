import { z } from "zod";

import { convertZodSchemaToDocsTemplate } from "@/drivers/webserver/utils/convertZodSchemaToDocsTemplate";

import { tag } from "./constants";

export const deleteUserPathParametersSchema = z.object({
  id: z.string(),
});

export const deleteUserHeadersSchema = z.object({
  authorization: z.string(),
});

export const deleteUserDocSchema = {
  tags: [tag],
  description: `Delete ${tag}`,
  params: convertZodSchemaToDocsTemplate({
    schema: deleteUserPathParametersSchema,
  }),
};
