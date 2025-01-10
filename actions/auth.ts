"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "@/lib/db";

const authCheckSchema = z.object({
  email: z.string().email(),
});

export async function authCheck(prevState: any, formData: FormData) {
  const validatedData = authCheckSchema.safeParse({
    email: formData.get("email") as string,
  });

  if (!validatedData.success) {
    return {
      emailError: validatedData.error.errors[0].message,
      formError: null,
      success: false,
      isRegistered: null,
    };
  } else {
    try {
      const data = await prisma.user.findUnique({
        where: { email: validatedData.data.email },
      });

      return {
        emailError: null,
        formError: null,
        success: true,
        isRegistered: data ? true : false,
      };
    } catch (error) {
      console.error("Database error:", error);
      return {
        emailError: null,
        formError: "Database error occurred. Please try again.",
        success: false,
        isRegistered: null,
      };
    }
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(30),
});

export async function authLogin(prevState: any, formData: FormData) {
  const validatedData = loginSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  const redirectUrl = formData.get("redirect") as string | null;

  if (!validatedData.success) {
    return {
      passwordError:
        validatedData.error.errors.find((error) => error.path[0] === "password")
          ?.message ?? null,
      formError:
        validatedData.error.errors.find((error) => error.path[0] === "email")
          ?.message ?? null,
      success: false,
    };
  } else {
    const data = await prisma.user.findUnique({
      where: {
        email: validatedData.data.email,
      },
    });

    if (!data) {
      return {
        passwordError: null,
        formError: "User not found",
        success: false,
      };
    }

    const passwordMatch = await bcrypt.compare(
      validatedData.data.password,
      data.password
    );

    if (!passwordMatch) {
      return {
        passwordError: "Incorrect password",
        formError: null,
        success: false,
      };
    } else {
      await saveUser(data, redirectUrl);

      return {
        passwordError: null,
        formError: null,
        success: true,
      };
    }
  }
}

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(50),
  password: z.string().min(8).max(30),
  confirmPassword: z.string().min(8).max(30),
});

export async function authRegister(prevState: any, formData: FormData) {
  const validatedData = registerSchema.safeParse({
    email: formData.get("email") as string,
    name: formData.get("name") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirm") as string,
  });
  const redirectUrl = formData.get("redirect") as string | null;

  if (!validatedData.success) {
    return {
      nameError:
        validatedData.error.errors.find((error) => error.path[0] === "name")
          ?.message ?? null,
      passwordError:
        validatedData.error.errors.find((error) => error.path[0] === "password")
          ?.message ?? null,
      confirmError:
        validatedData.error.errors.find(
          (error) => error.path[0] === "confirmPassword"
        )?.message ?? null,
      formError:
        validatedData.error.errors.find((error) => error.path[0] === "email")
          ?.message ?? null,
      success: false,
    };
  } else {
    const data = await prisma.user.create({
      data: {
        email: validatedData.data.email,
        name: validatedData.data.name,
        password: await bcrypt.hash(validatedData.data.password, 10),
      },
    });

    if (!data) {
      return {
        nameError: null,
        passwordError: null,
        confirmError: null,
        formError: "User not created. Please try again.",
        success: false,
      };
    } else {
      await saveUser(data, redirectUrl);

      return {
        nameError: null,
        passwordError: null,
        confirmError: null,
        formError: null,
        success: true,
      };
    }
  }
}

const saveUser = async (data: any, redirectUrl: string | null) => {
  const cookieStore = await cookies();
  const isAdmin = data.role === "ADMIN";

  const token = jwt.sign(
    {
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.name,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: isAdmin ? "7d" : "30d",
    }
  );

  cookieStore.set("auction_user_token", token, {
    maxAge: 60 * 60 * 24 * (isAdmin ? 7 : 30),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    value: token,
    sameSite: "strict",
  });

  redirect(
    redirectUrl && redirectUrl.includes("/admin")
      ? isAdmin
        ? redirectUrl
        : "/"
      : redirectUrl ?? "/"
  );
};
