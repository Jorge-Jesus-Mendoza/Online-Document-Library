import { authOptions } from "@/auth.configs";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";

export const getUserServerSession = async () => {
  const session = await getServerSession(authOptions);

  return session?.user;
};

export const signInEmailPassword = async (
  email: string,
  password: string,
  access_type: string
) => {
  if (!email || !password) return null;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user && access_type === "signIn") {
    const dbUser = await createUser(email, password);
    return dbUser;
  } else if (user && access_type === "signIn") {
    return null;
  }

  if (!bcrypt.compareSync(password, user?.password ?? "")) {
    return null;
  }

  return user;
};

const createUser = async (email: string, password: string) => {
  const user = await prisma.user.create({
    data: {
      email,
      password: bcrypt.hashSync(password),
      name: email.split("@")[0],
    },
  });

  return user;
};
