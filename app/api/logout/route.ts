import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  cookieStore.delete("auction_user_token");

  return NextResponse.json({ success: true });
}
