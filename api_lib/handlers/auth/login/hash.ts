import jwt from "jsonwebtoken"
import { hashPwd } from "../../../../src/utils/hash.js"

export async function POST(request: Request) {
  console.log(request)
  const pathname = new URL(request.url).pathname
  console.log(pathname)
  // check password hash
  const body: any = await request.json()
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  if (username === undefined || password === undefined) {
    throw new Error("ADMIN_USERNAME or ADMIN_PASSWORD is not set")
  }

  if (body.username !== username || body.password !== hashPwd(password)) {
    const failResult = {
      code: 400,
      message: "password is incorrect",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }

  const passwordCreatedTimestamp = 0
  const nowTimestamp = Math.floor(Date.now() / 1000)
  const expiredTimestamp = nowTimestamp + 86400
  const payload = {
    username: username,
    pwd_ts: passwordCreatedTimestamp,
    exp: expiredTimestamp,
    nbf: nowTimestamp,
    iat: nowTimestamp,
  }
  const jwtSecret = process.env.JWT_SECRET

  if (jwtSecret === undefined) {
    throw new Error("JWT_SECRET is not set")
  }

  var token = jwt.sign(payload, jwtSecret)
  const successResult = {
    code: 200,
    message: "success",
    data: {
      token: token,
    },
  }

  return new Response(JSON.stringify(successResult))
}
