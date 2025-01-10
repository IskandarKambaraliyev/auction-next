import { cookies } from "next/headers";
import useVerifyJWT from "./useVerifyJWT";

export default async function getUserInfo() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("auction_user_token");
  const secret = process.env.JWT_SECRET;

  if (!tokenCookie || !tokenCookie.value || !secret) {
    return null;
  } else {
    const decoded = await useVerifyJWT(tokenCookie.value, secret);

    if (!decoded) {
      return null;
    } else {
      return {
        userId: decoded.id as string,
        userEmail: decoded.email as string,
        userRole: decoded.role as "ADMIN" | "USER",
        userName: decoded.name as string,
      };
    }
  }
}
