export interface IBaseRepository<T> {
  findAll(query: any): Promise<{ data: T[], total: number}>;
  findOne(filter: Record<string, any>): Promise<T | null>;
  getById(id: string, sensitiveFields?: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  upsert(filter: Record<string, any>, data: Partial<T>, insertOnlyData: Record<string, any>): Promise<T | null>;
  update(filter: Record<string, any>, data: Partial<T>): Promise<T | null>;
  deleteSoft(filter: Record<string, any>): Promise<T | null>;
  delete(filter: Record<string, any>): Promise<boolean>;
}