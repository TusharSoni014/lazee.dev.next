import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import { cookies } from "next/headers";

import {
  generateVerificationEmailHtml,
  generateVerificationEmailText,
} from "@/lib/email-templates/verification-email";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
    }),
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || "Lazee.dev <no-reply@lazee.dev>",
      async sendVerificationRequest({ identifier, url, provider }) {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);

        const html = generateVerificationEmailHtml({
          identifier,
          url,
          host,
        });

        const text = generateVerificationEmailText({
          identifier,
          url,
          host,
        });

        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text,
          html,
        });
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      if (token?.sub) {
        if (token.email?.toLowerCase() === "techandrow@gmail.com") {
          token.isAdmin = true;
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { isAdmin: true, email: true },
          });
          token.isAdmin = Boolean(
            dbUser?.isAdmin || dbUser?.email?.toLowerCase() === "techandrow@gmail.com"
          );
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
        session.user.isAdmin = Boolean(
          token.isAdmin || session.user.email?.toLowerCase() === "techandrow@gmail.com"
        );
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser) {
        const cookieStore = await cookies();
        cookieStore.set("lazee_new_user", "1", {
          maxAge: 60 * 30,
          path: "/",
          sameSite: "lax",
        });

        if (account?.provider === "nodemailer" || account?.provider === "email") {
          const email = user.email?.toLowerCase() || "";
          const isGmail = email.endsWith("@gmail.com");
          if (!isGmail) {
            await prisma.user.update({
              where: { id: user.id },
              data: { credits: 0 },
            });
          }
        }
      } else {
        if (account?.provider === "google") {
          const currentUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { credits: true },
          });
          if (currentUser && currentUser.credits === 0) {
            await prisma.user.update({
              where: { id: user.id },
              data: { credits: 200 },
            });
          }
        }
      }
    },
    async linkAccount({ user, account }) {
      if (account?.provider === "google") {
        const currentUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { credits: true },
        });
        if (currentUser && currentUser.credits === 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: { credits: 200 },
          });
        }
      }
    },
  },
});
