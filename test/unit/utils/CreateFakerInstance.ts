/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */
/* eslint-disable new-cap */
import { faker } from "@faker-js/faker";

export function createFakerInstance<T>(cls: new () => T): T {
  const instance = new cls();
  for (const key of Object.keys(instance)) {
    instance[key] = generateFakeDataForType(typeof instance[key]);
  }
  return instance;
}

function generateFakeDataForType(type: string) {
  switch (type) {
    case "string":
      return faker.lorem.words();
    case "number":
      return faker.datatype.number();
    case "boolean":
      return faker.datatype.boolean();
    case "object":
      return faker.helpers.createCard();
    default:
      return null;
  }
}
