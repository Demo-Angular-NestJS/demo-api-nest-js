export interface IBaseService<T> {
  search(query: any): Promise<{ data: T[], total: number }>;
  getByFilter(filter: Record<string, any>): Promise<T | null>;
  getById(id: string, sensitiveFields?: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  upsert(filter: Record<string, any>, data: Partial<T>, userId: string): Promise<T | null>;
  update(filter: Record<string, any>, data: Partial<T>): Promise<T | null>;
  delete(filter: Record<string, any>, soft: boolean): Promise<boolean>;
}