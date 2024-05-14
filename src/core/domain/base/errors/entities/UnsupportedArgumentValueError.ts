import { EntityError } from "./EntityError";

export class UnsupportedArgumentValueError
  extends Error
  implements EntityError
{
  constructor(argument: string) {
    super(`Informed value for ${argument} is unsupported`);
  }
}
