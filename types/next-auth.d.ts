import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: string[]; // Aquí extendemos el tipo para incluir roles
      id?: string;
      sub?: string;
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpires?: number;
      iat?: number;
      exp?: number;
      jti?: number;
    };
  }
}
