import { z } from "zod";

import { convertZodSchemaToDocsTemplate } from "@/drivers/webserver/utils/convertZodSchemaToDocsTemplate";
import { generateSchemaFromSampleObject } from "@/drivers/webserver/utils/generateSchemaFromSampleObject";

import { GetUsersViewModel } from "../viewModels/GetUsersViewModel";
import { tag } from "./constants";

export const getUsersQueryParamsSchema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(20),
});

const responseExample: GetUsersViewModel = {
  data: [
    {
      id: "123",
      name: "John",
      email: "john.doe@test.com",
      taxVat: "123456789",
      createdAt: "2021-10-26",
      updatedAt: "2021-10-27",
    },
  ],
  pagination: {
    totalItems: 1,
    currentPage: 1,
    pageSize: 20,
    totalPages: 1,
  },
};

export const getUsersDocSchema = {
  tags: [tag],
  description: `Get ${tag}s`,
  querystring: convertZodSchemaToDocsTemplate({
    schema: getUsersQueryParamsSchema,
  }),
  response: {
    200: generateSchemaFromSampleObject(responseExample),
  },
};
