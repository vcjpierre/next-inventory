import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../config/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("SignIn attempt:", { user, account });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect attempt:", { url, baseUrl });
      
      if (url.startsWith(baseUrl)) {
        console.log("Redirecting to URL in same origin:", url);
        return url;
      }
      
      if (url.startsWith('/')) {
        console.log("Redirecting to relative URL:", `${baseUrl}${url}`);
        return `${baseUrl}${url}`;
      }
      
      console.log("Redirecting to baseUrl (default):", baseUrl);
      return baseUrl;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
export default NextAuth(authOptions);
