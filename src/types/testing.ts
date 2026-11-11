export interface QueryResult {
  data?: unknown;
  error?: { code?: string; message?: string } | null;
  count?: number | null;
}

export interface FakeCall {
  target: string;
  method: string;
  args: unknown[];
}

export interface FakeSupabase {
  /** Every table, rpc and auth call made through the fake, in order. */
  calls: FakeCall[];
  /** Queues the result returned by the next awaited query on a table or rpc name. */
  respond: (target: string, result: QueryResult) => void;
  client: {
    from: (table: string) => unknown;
    rpc: (name: string, args?: unknown) => unknown;
    auth: Record<string, (...args: unknown[]) => Promise<QueryResult>> & {
      admin: Record<string, (...args: unknown[]) => Promise<QueryResult>>;
    };
  };
}
