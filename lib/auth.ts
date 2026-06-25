import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";

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
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);

        const brandColor = "#f26c0d";
        const darkColor = "#1c130d";
        const bgColor = "#f8f7f5";

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: ${bgColor}; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border: 4px solid ${darkColor}; box-shadow: 8px 8px 0px ${darkColor}; margin: 0 auto; border-collapse: collapse;">
    <!-- Brand Header -->
    <tr>
      <td bgcolor="${brandColor}" style="padding: 24px; border-bottom: 4px solid ${darkColor}; text-align: center;">
        <span style="font-size: 26px; font-weight: 950; letter-spacing: -1px; text-transform: uppercase; color: ${darkColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">LAZEE.DEV</span>
      </td>
    </tr>
    <!-- Content Body -->
    <tr>
      <td style="padding: 44px 32px; text-align: left; background-color: #ffffff;">
        <h1 style="font-size: 28px; font-weight: 950; line-height: 1.1; margin: 0 0 16px 0; color: ${darkColor}; text-transform: uppercase; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">VERIFY YOUR EMAIL</h1>
        <p style="font-size: 16px; font-weight: 500; line-height: 1.5; color: #4a4a4a; margin: 0 0 32px 0;">We received a request to log in to your account. Click the button below to sign in to your dashboard instantly. This link will expire in 24 hours.</p>
        
        <!-- Button -->
        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
          <tr>
            <td align="left">
              <a href="${url}" target="_blank" style="display: inline-block; background-color: ${brandColor}; color: ${darkColor}; border: 3px solid ${darkColor}; box-shadow: 4px 4px 0px ${darkColor}; font-size: 18px; font-weight: 900; text-transform: uppercase; text-decoration: none; padding: 16px 32px; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                Sign In to Lazee.dev
              </a>
            </td>
          </tr>
        </table>
        
        <!-- URL Fallback -->
        <div style="border-top: 2px dashed ${darkColor}; padding-top: 24px;">
          <p style="font-size: 13px; color: #777777; margin: 0; line-height: 1.5; word-break: break-all;">
            If the button doesn't work, copy and paste this URL into your browser:
          </p>
          <p style="font-size: 13px; margin: 8px 0 0 0; word-break: break-all;">
            <a href="${url}" style="color: ${brandColor}; font-weight: bold; text-decoration: underline;">${url}</a>
          </p>
        </div>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="border-top: 4px solid ${darkColor}; padding: 24px; text-align: center; background-color: #faf9f6;">
        <p style="font-size: 12px; color: #888888; margin: 0; line-height: 1.4;">If you did not request this email, you can safely ignore it.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

        const text = `Sign in to ${host}\n\n${url}\n\n`;

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
  },
  callbacks: {
    async session({ session, user, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser) {
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
