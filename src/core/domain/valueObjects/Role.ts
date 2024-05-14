import { ValueObject } from "../base/entities/ValueObject";
import { UnsupportedArgumentValueError } from "../base/errors/entities/UnsupportedArgumentValueError";
import { RoleEnum } from "../enums/RoleEnum";

export interface RoleProps {
  name: RoleEnum;
}

export class Role extends ValueObject<RoleProps> {
  constructor(props: RoleProps) {
    super({
      ...props,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!Object.values(RoleEnum).includes(props.name as any)) {
      throw new UnsupportedArgumentValueError(Role.name);
    }
  }

  get name() {
    return this.props.name;
  }

  set name(value: RoleEnum) {
    this.props.name = value;
  }
}
