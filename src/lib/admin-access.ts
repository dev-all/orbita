import "server-only";
import { auth } from "@clerk/nextjs/server";
import { authConfigured, isAdminUser } from "./admin-policy";
export async function adminAccess() {
  if (!authConfigured()) return { status: "unconfigured" as const };
  const { userId } = await auth();
  if (!userId) return { status: "signed-out" as const };
  if (!isAdminUser(userId, process.env.ADMIN_USER_IDS))
    return { status: "forbidden" as const };
  return { status: "allowed" as const, userId };
}
