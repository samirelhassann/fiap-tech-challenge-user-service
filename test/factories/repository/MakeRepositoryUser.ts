/* eslint-disable default-param-last */

import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";

export function makeRepositoryUser(): User {
  const repositoryUser = {
    id: faker.string.uuid(),
    password_hash: faker.internet.password(),
    tax_vat: faker.string.numeric(11),
    updated_at: faker.date.recent(),
    created_at: faker.date.recent(),
    email: faker.internet.email(),
    name: faker.person.firstName(),
    role: "CLIENT",
  } as User;

  return repositoryUser;
}
