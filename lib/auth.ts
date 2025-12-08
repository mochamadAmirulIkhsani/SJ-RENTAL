import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

/**
 * Hash password menggunakan bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password dengan hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // Token berlaku 7 hari
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log("[verifyToken] Attempting to verify token with secret:", JWT_SECRET.substring(0, 10) + "...");
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log("[verifyToken] Token verified successfully for user:", decoded.email);
    return decoded;
  } catch (error) {
    console.error("[verifyToken] Token verification failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
