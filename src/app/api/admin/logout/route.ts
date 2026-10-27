import { ok, originChecked } from "@/lib/admin-guard";
import { destroySession } from "@/lib/auth";

/** Admin logout — deletes the server-side session and clears the cookie. */
export async function POST(req: Request) {
  const csrf = originChecked(req);
  if (csrf) return csrf;

  await destroySession();
  return ok({ message: "Signed out." });
}
