import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  findDemoUserByEmail,
  findDemoUserById,
  getPostSignInRedirect,
  parseSessionCookie,
  requireRole,
  type AppRole,
  type DemoAuthUser
} from "@/lib/auth/session";

export const SESSION_COOKIE_NAME = "dse-study-session";

export async function setSessionCookie(user: DemoAuthUser) {
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    JSON.stringify({
      userId: user.userId,
      role: user.role
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    }
  );
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  return parseSessionCookie(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function getCurrentDemoUser() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return findDemoUserById(session.userId);
}

export async function redirectIfSignedIn() {
  const session = await getCurrentSession();

  if (session) {
    redirect(getPostSignInRedirect(session.role));
  }
}

export async function requireServerRole(requiredRole: AppRole) {
  const session = await getCurrentSession();

  if (!requireRole(session, requiredRole)) {
    redirect("/sign-in");
  }

  return session;
}
