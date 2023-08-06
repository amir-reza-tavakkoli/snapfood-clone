import { db } from "../utils/db.server"

import type { User } from "@prisma/client"

import { evaluateUser } from "./evaluate.server"

import { checkUser } from "../utils/validate.server"

import { DEFAULT_USER_NAME } from "../constants"

export async function getUserByPhone({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<User | null> {
  try {
    const user = await db.user.findUnique({
      where: {
        phoneNumber,
      },
    })

    return user
  } catch (error) {
    throw error
  }
}

export async function createOrUpdateUser({
  phoneNumber,
  firstName,
  lastName,
  gender,
  birthday,
  email,
  isSuspended,
  verificationCode,
  verificationCodeExpiry,
  credit,
  isVerified,
}: Partial<User> & { phoneNumber: string }): Promise<User> {
  try {
    let user = await getUserByPhone({ phoneNumber })

    evaluateUser({ birthday, email, firstName, lastName, credit, phoneNumber })

    if (user) {
      user = await db.user.update({
        where: {
          phoneNumber,
        },
        data: {
          firstName,
          lastName,
          gender,
          birthday,
          email,
          verificationCode,
          verificationCodeExpiry,
          credit,
          isSuspended,
          isVerified,
        },
      })

      return user
    }

    const newUser = await db.user.create({
      data: {
        phoneNumber,
        firstName: firstName ?? DEFAULT_USER_NAME,
        lastName,
        gender,
        birthday,
        email,
        verificationCode,
        verificationCodeExpiry,
        credit,
        isSuspended,
        isVerified,
      },
    })

    return newUser
  } catch (error) {
    throw error
  }
}

export async function updateVerificationCode(
  phoneNumber: string,
  verificationCode: string,
  verificationCodeExpiry: Date,
): Promise<User | null> {
  try {
    if (!verificationCode || !verificationCodeExpiry) {
      throw new Response("مشکلی در تولید کد ارسالی پیش آمد", { status: 404 })
    }

    const user = await getUserByPhone({ phoneNumber })

    checkUser({ user })

    return await db.user.update({
      where: {
        phoneNumber,
      },
      data: {
        verificationCode,
        verificationCodeExpiry,
      },
    })
  } catch (error) {
    throw error
  }
}

export async function getUserByEmail({ email }: { email: string }) {
  try {
    const user = await db.user.findUnique({ where: { email } })

    return user
  } catch (error) {
    throw error
  }
}
