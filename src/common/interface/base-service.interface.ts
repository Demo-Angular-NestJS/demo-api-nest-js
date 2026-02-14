export interface IBaseService<T> {
  search(query: any): Promise<{ data: T[], total: number }>;
  getByFilter(filter: Record<string, any>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  upsert(filter: Record<string, any>, data: Partial<T>, userId: string): Promise<T | null>;
  update(filter: Record<string, any>, data: Partial<T>): Promise<T | null>;
  deleteSoft(filter: Record<string, any>): Promise<boolean>;
  delete(filter: Record<string, any>): Promise<boolean>;
}