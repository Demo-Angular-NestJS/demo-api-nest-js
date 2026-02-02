export interface IBaseRepository<T> {
  findAll(query: any): Promise<{ data: T[]; total: number }>;
  findOne(filter: Record<string, any>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(filter: Record<string, any>, data: Partial<T>): Promise<T | null>;
  delete(filter: Record<string, any>): Promise<boolean>;
}