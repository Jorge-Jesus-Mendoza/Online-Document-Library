import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import prisma from "./lib/prisma";
import { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { signInEmailPassword } from "./auth/components/actions/auth-actions";
import Spotify from "next-auth/providers/spotify";
import Twitch from "next-auth/providers/twitch";
import { JWT } from "next-auth/jwt";

interface UserWithError {
  error: string;
  // otras propiedades de User...
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
          placeholder: "tucorreo@email.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "******",
        },
        access_type: {
          label: "Type of Access",
          type: "text",
          placeholder: "signIn or logIn",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const user = await signInEmailPassword(
          credentials.email,
          credentials.password,
          credentials.access_type
        );

        if (!user) {
          throw new Error("Usuario o contraseña incorrectos");
        }

        if (user && !user.isActive) {
          throw new Error(
            "Su usuario se encuentra desactivado, contacte con un administrador"
          );
        }

        return user;
      },
    }),
    Spotify({
      clientId: process.env.NEXT_PUBLIC_AUTH_SPOTIFY_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_AUTH_SPOTIFY_SECRET ?? "",
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope:
            "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state",
        },
      },
      async profile(profile) {
        // Aquí puedes personalizar el perfil si es necesario
        return {
          id: profile.id,
          email: profile.email,
          name: profile.display_name,
          image: profile.images?.[0]?.url,
        };
      },
    }),
    Twitch({
      clientId: process.env.NEXT_PUBLIC_AUTH_TWITCH_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_AUTH_TWITCH_SECRET ?? "",
      async profile(profile) {
        // Aquí puedes personalizar el perfil si es necesario
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.preferred_username,
          image: profile.picture,
        };
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",

      clientSecret: process.env.GITHUB_SECRET ?? "",
      async profile(profile) {
        // Aquí puedes personalizar el perfil si es necesario
        return {
          id: profile.id,
          email: profile.email,
          name: profile.display_name,
          image: profile.images?.[0]?.url,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      const userWithError = user as unknown as UserWithError;

      if (userWithError.error) {
        throw new Error(userWithError.error);
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email ?? undefined },
        });

        if (!dbUser?.isActive) {
          throw new Error("El usuario no está activo");
        }

        // Manipulación del token usando el tipo genérico `JWT`
        token.roles = dbUser?.roles ? (dbUser.roles as string[]) : ["no-roles"];
        token.id = dbUser?.id ?? "no-uuid";
      }

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token as string; // Casting a string
        token.accessTokenExpires =
          Date.now() + (account.expires_in as number) * 1000;
      }

      // Devuelve el token si aún no ha expirado
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Si ha expirado, refresca el token
      return refreshAccessToken(token); // Asegúrate de retornar el token, que es de tipo `JWT`
    },

    async session({ session, token }) {
      // console.log("🚀 ~ session ~ token:", token);
      if (session?.user) {
        session.user.roles = token.roles as string[];
        session.user.id = token?.id as string;
        session.user.accessToken = token?.accessToken as string;
        session.user.sub = token?.sub as string;
        session.user.accessTokenExpires = token?.accessTokenExpires as number;
        session.user.refreshToken = token?.refreshToken as string; // Asegúrate de que sea un string
        session.user.exp = token?.exp as number;
        session.user.iat = token?.iat as number;
        session.user.jti = token?.jti as number;
      }
      return session;
    },
  },

  pages: {
    signIn: "/",
    newUser: "/admin/auth/singIn",
  },
};

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string, // Casting a string
        client_id: process.env.NEXT_PUBLIC_AUTH_SPOTIFY_ID ?? "",
        client_secret: process.env.NEXT_PUBLIC_AUTH_SPOTIFY_SECRET ?? "",
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
