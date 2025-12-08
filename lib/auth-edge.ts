import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production");

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Verify JWT token (Edge Runtime compatible)
 */
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);

    // Validate payload has required fields
    if (payload && typeof payload.userId === "number" && typeof payload.email === "string" && typeof payload.role === "string") {
      return payload as unknown as JWTPayload;
    }

    return null;
  } catch (error) {
    console.error("[verifyTokenEdge] Token verification failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Generate JWT token (Edge Runtime compatible)
 */
export async function generateTokenEdge(payload: JWTPayload): Promise<string> {
  return await new jose.SignJWT(payload as any).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").setIssuedAt().sign(JWT_SECRET);
}
