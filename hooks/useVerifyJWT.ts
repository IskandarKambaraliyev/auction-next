import { jwtVerify } from "jose";

export default async function useVerifyJWT(token: string, secret: string) {
  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return payload;
  } catch (err) {
    console.log("JWT verification failed:", err);
    return null;
  }
}
