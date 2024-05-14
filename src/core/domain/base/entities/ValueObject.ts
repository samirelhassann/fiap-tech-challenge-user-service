export abstract class ValueObject<T> {
  protected props: T;

  constructor(props: T) {
    this.props = props;
  }

  public equals(entity: ValueObject<T>) {
    return entity === this;
  }
}
