import { sendError, sendSuccess } from "@/lib/network";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return sendError("No token provided", 401);
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return sendSuccess(payload, "Token is valid", 200);
  } catch {
    return sendError("Invalid token", 401);
  }
}