import { ValueObject } from "../base/entities/ValueObject";

export interface CellPhoneProps {
  number: string;
}

export class CellPhone extends ValueObject<CellPhoneProps> {
  constructor(props: CellPhoneProps) {
    super({
      ...props,
    });
  }

  get number() {
    return this.props.number;
  }
}
