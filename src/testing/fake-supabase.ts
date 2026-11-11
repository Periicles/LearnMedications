import type { FakeCall, FakeSupabase, QueryResult } from "@/types/testing";

const EMPTY_RESULT: QueryResult = { data: null, error: null, count: null };
const AUTH_METHODS = [
  "getClaims",
  "signInWithPassword",
  "signUp",
  "signOut",
  "resetPasswordForEmail",
  "updateUser",
  "exchangeCodeForSession",
  "verifyOtp",
];

/**
 * Minimal chainable stand-in for the Supabase client. Any builder method can be chained;
 * awaiting the chain resolves to the next result queued with `respond` for that table or rpc.
 */
export function createFakeSupabase(): FakeSupabase {
  const calls: FakeCall[] = [];
  const queues = new Map<string, QueryResult[]>();
  const nextResult = (target: string): QueryResult => ({
    ...EMPTY_RESULT,
    ...(queues.get(target)?.shift() ?? {}),
  });

  const makeBuilder = (target: string): unknown =>
    new Proxy(
      {},
      {
        get: (_builder, method: string) => {
          if (method === "then") {
            const result = Promise.resolve(nextResult(target));
            return result.then.bind(result);
          }
          return (...args: unknown[]) => {
            calls.push({ target, method, args });
            return makeBuilder(target);
          };
        },
      },
    );

  const makeAuthMethod =
    (method: string) =>
    (...args: unknown[]) => {
      calls.push({ target: "auth", method, args });
      return Promise.resolve(nextResult(`auth.${method}`));
    };
  const auth = Object.fromEntries(AUTH_METHODS.map((method) => [method, makeAuthMethod(method)]));

  return {
    calls,
    respond: (target, result) => queues.set(target, [...(queues.get(target) ?? []), result]),
    client: {
      from: (table) => makeBuilder(table),
      rpc: (name, args) => {
        calls.push({ target: name, method: "rpc", args: [args] });
        return makeBuilder(name);
      },
      auth: { ...auth, admin: { deleteUser: makeAuthMethod("admin.deleteUser") } },
    },
  };
}
