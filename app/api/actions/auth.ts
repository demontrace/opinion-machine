'use server';

import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/security/password";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/security/jwt";

type LoginState = {
  message?: string
};

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function login(state: LoginState, formData: FormData): Promise<LoginState> {
  const body = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });
  if (!body.success) return { message: "An unexpected error has occurred. Please try again." };

  const user = await prisma.user.findUnique({ where: { username: body.data.username } });
  if (!user || !verifyPassword(body.data.password, user.password)) return { message: "Incorrect username or password" };
  if (user.isBanned) return { message: "Your account has been suspended. Contact an administrator for more information." };
  if (user.isActive) redirect("/signup/activate"); // Don't ask me why.

  const session = await encrypt({ username: user.username });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1_814_400,
    path: "/",
  });

  redirect("/");
}
