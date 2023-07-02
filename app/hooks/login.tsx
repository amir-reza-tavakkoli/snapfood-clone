import { useEffect, useState } from "react"

import type { LoginActionData, LoginPageState } from "~/routes/login"

const phoneCookieName = "phoneNumber"

export function useLogin(actionData: LoginActionData) {
  const [phoneNumber, setPhoneNumber] = useState<string>("")

  const [verificationCode, setVerificationCode] = useState<String>("")

  const [pgaeState, setPageState] = useState<LoginPageState>("phoneNumber")

  useEffect(() => {
    if (pgaeState === "phoneNumber" && actionData && actionData.codeSent) {
      setPageState("verification")
    }
  }, [actionData?.codeSent])

  useEffect(() => {
    if (pgaeState === "verification") {
      setPhoneNumber(sessionStorage.getItem(phoneCookieName)!)
    }
  }, [verificationCode])

  useEffect(() => {
    if (pgaeState === "phoneNumber" && phoneNumber && phoneNumber !== "") {
      sessionStorage.setItem(phoneCookieName, phoneNumber)
    }
  }, [phoneNumber])

  return {
    pgaeState,
    setPageState,
    phoneNumber,
    setPhoneNumber,
    verificationCode,
    setVerificationCode,
  }
}
