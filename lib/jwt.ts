import { jwtVerify } from "jose"

interface JWTPayload {
  id: string
  email: string
  type: "customer" | "partner"
  isAuthenticated: boolean
  userType: "customer" | "partner"
}

export async function verify(token: string): Promise<JWTPayload | null> {
  try {
    console.log("Verifying JWT token...")
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")
    const { payload } = await jwtVerify(token, secret)
    console.log("JWT payload:", payload)
    
    // Return the payload with user type information
    const result = {
      id: payload.id as string,
      email: payload.email as string,
      type: payload.type as "customer" | "partner",
      userType: payload.type as "customer" | "partner",
      isAuthenticated: true
    }
    console.log("Processed JWT result:", result)
    return result
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
} 