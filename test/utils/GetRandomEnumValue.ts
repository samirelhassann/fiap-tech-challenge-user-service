import { faker } from "@faker-js/faker";

export function getRandomEnumValue<T extends object>(enumObj: T): T[keyof T] {
  const enumValues = Object.values(enumObj) as unknown as T[keyof T][];
  const randomIndex = faker.number.int({
    min: 0,
    max: enumValues.length - 1,
  });
  return enumValues[randomIndex];
}
