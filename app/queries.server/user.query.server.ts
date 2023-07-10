import type { User } from "@prisma/client"
import { db } from "../utils/db.server"

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
  isVerified,
}: {
  phoneNumber: string
  firstName?: string
  lastName?: string
  gender?: boolean
  birthday?: string
  email?: string
  isSuspended?: boolean
  isVerified?: boolean
}): Promise<User> {
  try {
    let user = await getUserByPhone({ phoneNumber })

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
          isSuspended,
          isVerified,
        },
      })

      return user
    }

    const newUser = await db.user.create({
      data: {
        phoneNumber,
        firstName,
        lastName,
        gender,
        birthday,
        email,
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
      throw new Error("Provide Verification Information")
    }

    const user = await getUserByPhone({ phoneNumber })

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("User Not Found")
    }

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
