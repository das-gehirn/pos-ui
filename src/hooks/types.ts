import { Paginator } from "@/components/table/type";

export interface GetManyProps<T> {
  data: T;
  paginator: Paginator;
}
