import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { sendError } from "../network";
import { UserAuth } from "../types";

export type AuthenticatedHandler = (
  req: NextRequest,
  payload: UserAuth
) => Promise<NextResponse> | NextResponse;

// Load your secret from env
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    try {
      const { payload } = await jwtVerify(token, SECRET);
      return handler(req, payload as unknown as UserAuth);
    } catch (err) {
      console.log(err);
      return sendError("Unauthenticated", 401);
    }
  };
}
