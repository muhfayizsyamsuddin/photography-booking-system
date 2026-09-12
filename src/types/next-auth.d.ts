import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "ADMIN";
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: "ADMIN";
  }
}