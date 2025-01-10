import { NextRequest, NextResponse } from "next/server";
import getUserInfo from "./hooks/getUserInfo";

export async function middleware(req: NextRequest) {
  const userInfo = await getUserInfo();

  if (!userInfo || userInfo.userRole !== "ADMIN") {
    console.log("User is not an admin or not logged in.");
    return NextResponse.redirect(new URL(`/auth`, req.url));
  }

  console.log("middleware: ADMIN USER");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
