// src/shared/lib/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

export const authConfig: NextAuthConfig = {
  secret:  process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages:   { signIn: "/login" },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // ← id aur userId dono set karo
        token.id           = user.id;
        token.userId       = user.id;
        token.role         = (user as any).role;
        token.unitId       = (user as any).unitId;
        token.commandLevel = (user as any).commandLevel;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        // ← userId token.id se lo (fallback)
        (session.user as any).userId       = token.id ?? token.userId;
        (session.user as any).role         = token.role;
        (session.user as any).unitId       = token.unitId;
        (session.user as any).commandLevel = token.commandLevel;
      }
      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return null;

        // Account lock check
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("ACCOUNT_LOCKED");
        }

        const valid = await bcrypt.compare(password, user.passwordHash);

        if (!valid) {
          // Increment failed attempts
          const attempts = user.failedAttempts + 1;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedAttempts: attempts,
              // Lock for 30 min after 5 attempts
              ...(attempts >= 5 && {
                lockedUntil: new Date(Date.now() + 30 * 60 * 1000),
              }),
            },
          });
          return null;
        }

        // Reset failed attempts on success
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedAttempts: 0,
            lockedUntil:    null,
            lastLoginAt:    new Date(),
          },
        });

        // Log login history
        await prisma.loginHistory.create({
          data: {
            userId:    user.id,
            success:   true,
            ipAddress: null,
          },
        });

        return {
          id:           user.id,
          name:         user.name,
          email:        user.email,
          role:         user.role,
          unitId:       user.unitId,
          commandLevel: user.commandLevel,
        };
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
