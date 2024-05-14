import { ValueObject } from "../base/entities/ValueObject";
import { ValueObjectValidationError } from "../base/errors/valueObjects/ValueObjectValidationError";

export interface TaxvatProps {
  number: string;
}

export class Taxvat extends ValueObject<TaxvatProps> {
  constructor(props: TaxvatProps) {
    super({
      ...props,
    });
    this.validate();
  }

  get number() {
    return this.props.number;
  }

  private validate(): void {
    if (!this.number) {
      throw new ValueObjectValidationError(Taxvat.name, [
        "Taxvat number is required",
      ]);
    }

    if (!/^\d+$/.test(this.number)) {
      throw new ValueObjectValidationError(Taxvat.name, [
        "Taxvat number must contain only numbers",
      ]);
    }
  }
}
