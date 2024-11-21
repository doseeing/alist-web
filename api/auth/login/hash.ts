import jwt from "jsonwebtoken"

const jwtSecret = "shhhhh"

export async function POST(request: Request) {
  // check password hash
  const body: any = await request.json()
  console.log(body)
  if (body.username !== "admin") {
    const failResult = {
      code: 400,
      message: "password is incorrect",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }
  // TODO: persist the password hash in KV
  const passwordCreatedTimestamp = 1732102259
  const nowTimestamp = Math.floor(Date.now() / 1000)
  const expiredTimestamp = nowTimestamp + 86400
  const payload = {
    username: "admin",
    pwd_ts: passwordCreatedTimestamp,
    exp: expiredTimestamp,
    nbf: nowTimestamp,
    iat: nowTimestamp,
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
