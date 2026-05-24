import axios from "axios";
import NextAuth, {
  DefaultSession,
  DefaultUser,
  NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      address?: Address;
      name?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    address?: Address;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    address?: Address;
    name?: string;
  }
}

export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", name: "email" },
        password: { label: "Password", name: "password" },
      },

      async authorize(credentials) {
        try {
          const { data } = await axios.post(
            `${process.env.SERVER}/api/user/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            },
          );

          return data;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/auth-failed",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // -------------------------
    // GOOGLE / SIGNIN FLOW
    // -------------------------
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { data } = await axios.post(
            `${process.env.SERVER}/api/user/login`,
            {
              email: user.email,
              provider: "google",
            },
          );

          user.id = data.id;
          user.role = data.role;
          user.address = data.address;
          user.name = data.name;

          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }

      return true;
    },

    // -------------------------
    // JWT (MAIN FIX HERE)
    // -------------------------
    async jwt({ token, user, trigger }) {
      // 1. initial login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name ?? undefined;
        token.address = user.address ?? undefined;
      }

      // 2. when session.update() is called
      if (trigger === "update" && token.id) {
        const { data } = await axios.get(
          `${process.env.SERVER}/api/user/${token.id}`,
        );

        token.address = data.address;
        token.name = data.name;
        token.role = data.role;
      }

      return token;
    },

    // -------------------------
    // SESSION
    // -------------------------
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.address = token.address;
        session.user.name = token.name;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
