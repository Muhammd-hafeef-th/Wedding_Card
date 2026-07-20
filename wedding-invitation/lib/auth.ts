import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./mongodb";
import Admin from "@/models/Admin";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();

        const admin = await Admin.findOne({
          email: credentials.email.toString().toLowerCase(),
        });

        if (!admin) {
          throw new Error("Invalid credentials");
        }

        const isValid = await admin.comparePassword(
          credentials.password.toString()
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: admin._id.toString(),
          email: admin.email,
        };
      },
    }),
  ],
});
