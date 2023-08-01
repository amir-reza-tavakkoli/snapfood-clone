import { useEffect, useState } from "react"

import type { LoginActionData, LoginPageState } from "../routes/_home.login"

import { COOKIE_PHONE } from "../constants"

export function useLogin(actionData: LoginActionData) {
  const [phoneNumber, setPhoneNumber] = useState<string>("")

  const [verificationCode, setVerificationCode] = useState<String>("")

  const [pgaeState, setPageState] = useState<LoginPageState>("phoneNumber")

  const [timerFinished, setTimerFinished] = useState(false)

  useEffect(() => {
    if (pgaeState === "phoneNumber" && actionData && actionData.codeSent) {
      setPageState("verification")
    }
  }, [actionData?.codeSent])

  useEffect(() => {
    if (pgaeState === "verification") {
      setPhoneNumber(sessionStorage.getItem(COOKIE_PHONE)!)
    }
  }, [verificationCode])

  useEffect(() => {
    if (pgaeState === "phoneNumber" && phoneNumber && phoneNumber !== "") {
      sessionStorage.setItem(COOKIE_PHONE, phoneNumber)
    }
  }, [phoneNumber])

  return {
    pgaeState,
    setPageState,
    phoneNumber,
    setPhoneNumber,
    verificationCode,
    setVerificationCode,
    timerFinished,
    setTimerFinished,
  }
}
