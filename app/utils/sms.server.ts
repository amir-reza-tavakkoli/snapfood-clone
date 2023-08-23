const MelipayamakApi = require("./../../node_modules/melipayamak/index")

export async function sendSMS({ to, text }: { to: string; text: string }) {
  const username = process.env.usernameSMS

  const password = process.env.passwordSMS

  const api = new MelipayamakApi(username, password)

  const sms = api.sms()

  const from = process.env.fromSMS

  const isflash = false

  const id = await sms.send(to, from, text, isflash)

  console.log(id, "SMS")

  return id
}
