import { z } from "zod";

import { RoleEnum } from "@/core/domain/enums/RoleEnum";

import { tag } from "./constants";

export const registerPayloadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  taxVat: z.string(),
  password: z.string(),
  role: z.nativeEnum(RoleEnum).default(RoleEnum.CLIENT),
});

export const registerDocSchema = {
  tags: [tag],
  description: `Register`,
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      taxVat: { type: "string" },
      password: { type: "string" },
      role: { type: "string", enum: Object.values(RoleEnum) },
    },
  },
};
