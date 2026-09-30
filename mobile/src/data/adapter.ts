export type Params = (string | number | null)[];
export interface SqlAdapter {
  exec(sql: string): Promise<void>;
  run(sql: string, params?: Params): Promise<void>;
  all<T>(sql: string, params?: Params): Promise<T[]>;
  close(): Promise<void>;
}
