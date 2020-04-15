export class DataBase {
  id: number;
  version: number;
  create_time: string;
  update_time: string;
}

export class Pagination<T> {
  firstPage: boolean;
  lastPage: boolean;
  list: T[];
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRow: number;
}