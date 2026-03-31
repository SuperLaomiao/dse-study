import crypto from "crypto";

import { getDataAccessMode } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import type { FamilyRole } from "@prisma/client";

export interface CreateInviteInput {
  familyId: string;
  email: string;
  role: FamilyRole;
  expiresInDays?: number;
}

export interface InviteInfo {
  id: string;
  familyId: string;
  email: string;
  role: FamilyRole;
  expiresAt: Date;
  familyName?: string;
  inviterName?: string;
  isValid: boolean;
  isExpired: boolean;
  isAccepted: boolean;
}

function generateInviteToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createInvite(input: CreateInviteInput): Promise<{ inviteToken: string; expiresAt: Date } | null> {
  const { familyId, email, role, expiresInDays = 7 } = input;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  const inviteToken = generateInviteToken();

  if (getDataAccessMode() === "database") {
    try {
      await prisma.familyInvite.create({
        data: {
          familyId,
          email: email.toLowerCase().trim(),
          role,
          inviteToken,
          expiresAt
        }
      });

      return { inviteToken, expiresAt };
    } catch (error) {
      console.error("Failed to create invite in database", error);
      return null;
    }
  }

  // Demo mode: return a fake token
  return { inviteToken: "demo-invite-token-" + Date.now(), expiresAt };
}

export async function getInviteByToken(token: string): Promise<InviteInfo | null> {
  if (getDataAccessMode() === "database") {
    try {
      const invite = await prisma.familyInvite.findUnique({
        where: { inviteToken: token },
        include: { family: { include: { createdByUser: true } } }
      });

      if (!invite) {
        return null;
      }

      const now = new Date();

      return {
        id: invite.id,
        familyId: invite.familyId,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
        familyName: invite.family?.name,
        inviterName: invite.family?.createdByUser?.displayName,
        isValid: !invite.acceptedAt && now < invite.expiresAt,
        isExpired: now > invite.expiresAt,
        isAccepted: !!invite.acceptedAt
      };
    } catch (error) {
      console.error("Failed to get invite by token", error);
      return null;
    }
  }

  // Demo mode: handle demo token
  if (token.startsWith("demo-invite-") || token === "demo-invite-token") {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return {
      id: "demo-invite-id",
      familyId: "demo-family-id",
      email: "learner@example.com",
      role: "learner",
      expiresAt,
      familyName: "Chan Family",
      inviterName: "Mr Chan",
      isValid: true,
      isExpired: false,
      isAccepted: false
    };
  }

  return null;
}

export async function acceptInvite(token: string, userId: string): Promise<boolean> {
  if (getDataAccessMode() === "database") {
    try {
      const invite = await prisma.familyInvite.findUnique({
        where: { inviteToken: token }
      });

      if (!invite) {
        return false;
      }

      const now = new Date();

      if (invite.acceptedAt || now > invite.expiresAt) {
        return false;
      }

      // Use transaction to ensure both operations complete
      await prisma.$transaction([
        prisma.familyInvite.update({
          where: { id: invite.id },
          data: { acceptedAt: now }
        }),
        prisma.familyMembership.create({
          data: {
            familyId: invite.familyId,
            userId,
            role: invite.role,
            status: "active"
          }
        })
      ]);

      return true;
    } catch (error) {
      console.error("Failed to accept invite", error);
      return false;
    }
  }

  // Demo mode: always succeed
  return true;
}

export async function acceptInviteAfterCreateUser(token: string, userId: string, familyId: string): Promise<boolean> {
  if (getDataAccessMode() === "database") {
    try {
      const invite = await prisma.familyInvite.findUnique({
        where: { inviteToken: token }
      });

      if (!invite) {
        return false;
      }

      const now = new Date();

      if (invite.acceptedAt || now > invite.expiresAt) {
        return false;
      }

      await prisma.$transaction([
        prisma.familyInvite.update({
          where: { id: invite.id },
          data: { acceptedAt: now }
        }),
        prisma.familyMembership.create({
          data: {
            familyId,
            userId,
            role: invite.role,
            status: "active"
          }
        })
      ]);

      return true;
    } catch (error) {
      console.error("Failed to accept invite after create user", error);
      return false;
    }
  }

  return true;
}

export async function checkUserIsFamilyAdmin(familyId: string, userId: string): Promise<boolean> {
  if (getDataAccessMode() === "database") {
    try {
      const family = await prisma.family.findFirst({
        where: {
          id: familyId,
          createdByUserId: userId
        }
      });

      // Also check if user is an admin via membership (in case we add admin role later)
      if (!family) {
        const membership = await prisma.familyMembership.findFirst({
          where: {
            familyId,
            userId,
            role: "mom_admin"
          }
        });
        return !!membership;
      }

      return true;
    } catch (error) {
      console.error("Failed to check admin status", error);
      return false;
    }
  }

  // Demo mode: always return true for demo purposes
  return true;
}

export async function getFirstUserFamilyId(userId: string): Promise<string | null> {
  if (getDataAccessMode() === "database") {
    try {
      // First check if user created any family
      const createdFamily = await prisma.family.findFirst({
        where: { createdByUserId: userId }
      });

      if (createdFamily) {
        return createdFamily.id;
      }

      // Then check memberships where user is admin
      const adminMembership = await prisma.familyMembership.findFirst({
        where: { userId, role: "mom_admin" }
      });

      if (adminMembership) {
        return adminMembership.familyId;
      }

      return null;
    } catch (error) {
      console.error("Failed to get user family", error);
      return null;
    }
  }

  // Demo mode
  return "demo-family-id";
}
