import { auth } from "@clerk/nextjs/server";

/**
 * Returns the current company ID (Clerk orgId) for use in server components
 * and API routes. Throws if the user is not signed in or has no active org.
 */
export async function requireCompanyId(): Promise<string> {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Fall back to userId if orgs not enabled / user hasn't created one yet.
  // This lets a solo user work before they set up an org.
  return orgId ?? userId;
}

/**
 * Same as requireCompanyId but returns null instead of throwing —
 * useful in layouts where you want to handle the unauth case gracefully.
 */
export async function getCompanyId(): Promise<string | null> {
  try {
    return await requireCompanyId();
  } catch {
    return null;
  }
}
