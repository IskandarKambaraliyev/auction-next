import { NextRequest, NextResponse } from "next/server";
import getUserInfo from "./hooks/getUserInfo";

export async function middleware(req: NextRequest) {
  const userInfo = await getUserInfo();

  const nextUrl = req.nextUrl.pathname;

  if (nextUrl.startsWith("/admin")) {
    if (!userInfo || userInfo.userRole !== "ADMIN") {
      console.log("User is not an admin or not logged in.");
      return NextResponse.redirect(
        new URL(`/auth?redirect=${nextUrl}`, req.url)
      );
    }
  }

  if (
    nextUrl === "/lots" ||
    nextUrl === "/lots/create" ||
    nextUrl === "/lots/bids"
  ) {
    if (!userInfo) {
      console.log("User is not logged in.");
      return NextResponse.redirect(
        new URL(`/auth?redirect=${nextUrl}`, req.url)
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
