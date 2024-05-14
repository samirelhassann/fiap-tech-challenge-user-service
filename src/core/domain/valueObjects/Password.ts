import { createHash } from "crypto";

import { ValueObject } from "../base/entities/ValueObject";

export interface PasswordProps {
  value: string;
}

export class Password extends ValueObject<PasswordProps> {
  constructor(props: PasswordProps) {
    super({
      ...props,
    });
  }

  get value() {
    return this.props.value;
  }

  public comparePassword(valueToCompare: string): boolean {
    const hashedValue = Password.valueToHash(valueToCompare);

    return hashedValue === this.value;
  }

  public static valueToHash(valueToHash: string): string {
    const hash = createHash("sha256");
    hash.update(valueToHash);

    return hash.digest("hex");
  }
}
