import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { TestUser } from "@/types/e2e";
import { loadTestEnv, TEST_PASSWORD } from "./env";

loadTestEnv();

export function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SECRET_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/** Creates a confirmed account through the admin API: no e-mail is sent. */
export async function createTestUser(label: string): Promise<TestUser> {
  const suffix = randomBytes(4).toString("hex");
  const username = `e2e_${label}_${suffix}`.slice(0, 20);
  const email = `e2e-${label}-${suffix}@pharmalingo.test`;
  const { data, error } = await adminClient().auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { username },
  });
  if (error || !data.user) throw new Error(`Could not create test user: ${error?.message}`);
  return { id: data.user.id, email, username, password: TEST_PASSWORD };
}

export async function deleteTestUser(userId: string): Promise<void> {
  await adminClient().auth.admin.deleteUser(userId);
}

/** Inserts a pending friend request from one test user to another. */
export async function requestFriendship(requesterId: string, addresseeId: string): Promise<void> {
  const { error } = await adminClient()
    .from("friendships")
    .insert({ requester_id: requesterId, addressee_id: addresseeId });
  if (error) throw new Error(`Could not create friend request: ${error.message}`);
}
