export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;

export class PaginationParams {
  private _page: number;

  private _size: number;

  constructor(page: number = DEFAULT_PAGE, size: number = DEFAULT_PAGE_SIZE) {
    this._page = page;
    this._size = size;
  }

  get page() {
    return this._page;
  }

  get size() {
    return this._size;
  }
}
