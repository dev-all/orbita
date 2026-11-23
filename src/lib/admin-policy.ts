export function isAdminUser(
  userId: string | null,
  allowed: string | undefined,
) {
  return (
    !!userId &&
    (allowed ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .includes(userId)
  );
}
export function authConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !!process.env.CLERK_SECRET_KEY
  );
}
