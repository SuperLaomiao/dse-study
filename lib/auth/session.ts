export type AppRole = "admin" | "learner";

export interface SessionUser {
  userId: string;
  role: AppRole;
}

export interface DemoAuthUser extends SessionUser {
  email: string;
  name: string;
  password?: string;
}

const demoUsers: DemoAuthUser[] = [
  {
    userId: "mom-admin",
    role: "admin",
    email: "mom@example.com",
    name: "Mom Admin",
    password: "demo-admin-pass"
  },
  {
    userId: "older-brother",
    role: "learner",
    email: "brother@example.com",
    name: "Older Brother",
    password: "demo-brother-pass"
  },
  {
    userId: "younger-sister",
    role: "learner",
    email: "sister@example.com",
    name: "Younger Sister",
    password: "demo-sister-pass"
  }
];

export function findDemoUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return demoUsers.find((user) => user.email === normalizedEmail) ?? null;
}

export function findDemoUserById(userId: string) {
  return demoUsers.find((user) => user.userId === userId) ?? null;
}

export function findDemoUserByCredentials(email: string, password: string) {
  const user = findDemoUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  return user;
}

export function parseSessionCookie(value: string | undefined | null): SessionUser | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<SessionUser>;

    if (
      typeof parsed.userId === "string" &&
      (parsed.role === "admin" || parsed.role === "learner")
    ) {
      return {
        userId: parsed.userId,
        role: parsed.role
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function getPostSignInRedirect(role: AppRole) {
  return role === "admin" ? "/admin/family" : "/home";
}

export function requireRole(
  session: SessionUser | null,
  requiredRole: AppRole
) {
  return session?.role === requiredRole;
}
