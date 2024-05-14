export interface PaginationResponseProps<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export class PaginationResponse<T> {
  readonly props: PaginationResponseProps<T>;

  constructor(props: PaginationResponseProps<T>) {
    this.props = props;
  }

  get data(): T[] {
    return this.props.data;
  }

  hasNextPage(): boolean {
    return this.props.currentPage < this.props.totalPages;
  }

  hasPreviousPage(): boolean {
    return this.props.currentPage > 1;
  }

  toResponse<K>(converter: (item: T) => K) {
    return {
      data: this.props.data.map(converter),
      pagination: {
        totalItems: this.props.totalItems,
        currentPage: this.props.currentPage,
        pageSize: this.props.pageSize,
        totalPages: this.props.totalPages,
      },
    };
  }
}
