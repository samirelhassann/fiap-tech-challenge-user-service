import { z } from "zod";

import { convertZodSchemaToDocsTemplate } from "@/drivers/webserver/utils/convertZodSchemaToDocsTemplate";
import { generateSchemaFromSampleObject } from "@/drivers/webserver/utils/generateSchemaFromSampleObject";

import { GetUserByIdViewModel } from "../viewModels/GetUserByIdViewModel";
import { tag } from "./constants";

export const getUserByIdQueryParamsSchema = z.object({
  id: z.string(),
});

const responseExample: GetUserByIdViewModel = {
  id: "123",
  name: "John",
  email: "john@example.com",
  taxVat: "456",
  createdAt: "2023-10-26",
  updatedAt: "2023-10-27",
};

export const getUserByIdDocSchema = {
  tags: [tag],
  description: `Get ${tag} by id`,
  params: convertZodSchemaToDocsTemplate({
    schema: getUserByIdQueryParamsSchema,
  }),
  response: {
    200: generateSchemaFromSampleObject(responseExample),
  },
};
