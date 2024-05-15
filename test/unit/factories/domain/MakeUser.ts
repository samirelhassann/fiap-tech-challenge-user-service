/* eslint-disable default-param-last */

import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { User, UserProps } from "@/core/domain/entities/User";
import { RoleEnum } from "@/core/domain/enums/RoleEnum";
import { Password } from "@/core/domain/valueObjects/Password";
import { Role } from "@/core/domain/valueObjects/Role";
import { Taxvat } from "@/core/domain/valueObjects/Taxvat";
import { faker } from "@faker-js/faker";
import { getRandomEnumValue } from "@test/unit/utils/GetRandomEnumValue";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId
): User {
  const newUser = new User(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      taxVat: new Taxvat({ number: "12345678900" }),
      passwordHash: new Password({ value: faker.internet.password() }),
      role: new Role({
        name: getRandomEnumValue(RoleEnum),
      }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...override,
    },
    id
  );

  return newUser;
}
