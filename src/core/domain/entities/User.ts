import { AggregateRoot } from "../base/entities/AggregateRoot";
import { UniqueEntityId } from "../base/entities/UniqueEntityId";
import { Optional } from "../base/types/Optional";
import { Password } from "../valueObjects/Password";
import { Role } from "../valueObjects/Role";
import { Taxvat } from "../valueObjects/Taxvat";

export interface UserProps {
  name: string;
  email: string;
  taxVat: Taxvat;
  passwordHash: Password;
  role: Role;
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  constructor(props: Optional<UserProps, "createdAt">, id?: UniqueEntityId) {
    super(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value;
    this.touch();
  }

  get taxVat() {
    return this.props.taxVat;
  }

  set taxVat(value: Taxvat) {
    this.props.taxVat = value;
    this.touch();
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get role() {
    return this.props.role;
  }

  set role(value: Role) {
    this.props.role = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
