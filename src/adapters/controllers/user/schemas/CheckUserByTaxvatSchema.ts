import { z } from "zod";

import { convertZodSchemaToDocsTemplate } from "@/drivers/webserver/utils/convertZodSchemaToDocsTemplate";
import { generateSchemaFromSampleObject } from "@/drivers/webserver/utils/generateSchemaFromSampleObject";
import { jwtHeaderDocsSchemaTemplate } from "@/drivers/webserver/utils/jwtHeaderDocTemplate";

import { CheckUserByTaxvatViewModel } from "../viewModels/CheckUserByTaxvatViewModel";
import { tag } from "./constants";

export const checkUserByTaxvatQueryParamsSchema = z.object({
  taxvat: z.string(),
});

const responseExample: CheckUserByTaxvatViewModel = {
  exist: true,
};

export const checkUserByTaxvatDocSchema = {
  tags: [tag],
  description: `Check if there is registered ${tag} with the given taxvat.`,
  headers: jwtHeaderDocsSchemaTemplate,
  querystring: convertZodSchemaToDocsTemplate({
    schema: checkUserByTaxvatQueryParamsSchema,
  }),
  response: {
    200: generateSchemaFromSampleObject(responseExample),
  },
};
