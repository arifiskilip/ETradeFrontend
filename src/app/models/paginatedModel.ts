import { Pagination } from "./pagination";

export class PaginatedModel<T>{
    items:T;
    pagination:Pagination;
}