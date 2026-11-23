import { ClerkProvider } from "@clerk/nextjs";
import { authConfigured } from "@/lib/admin-policy";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return authConfigured() ? (
    <ClerkProvider>{children}</ClerkProvider>
  ) : (
    children
  );
}
