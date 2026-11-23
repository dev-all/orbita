import { clerkMiddleware } from "@clerk/nextjs/server";
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from "next/server";
import { authConfigured } from "@/lib/admin-policy";
const clerk = clerkMiddleware();
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!authConfigured()) return NextResponse.next();
  return clerk(request, event);
}
export const config = { matcher: ["/admin/:path*"] };
