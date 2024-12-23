import jwt from "jsonwebtoken"

const jwtSecret = process.env.JWT_SECRET

const successResult = {
  code: 200,
  message: "success",
  data: {
    id: 1,
    username: process.env.ADMIN_USERNAME,
    password: "",
    base_path: "/",
    role: 2,
    disabled: false,
    permission: 0,
    sso_id: "",
    otp: false,
  },
}

const failResult = {
  code: 401,
  message: "Guest user is disabled, login please",
  data: null,
}

export function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")
    if (!token) {
      return new Response(JSON.stringify(failResult))
    }
    if (!jwtSecret) {
      return new Response(JSON.stringify(failResult))
    }
    let decoded = jwt.verify(token, jwtSecret)
  } catch (err) {
    return new Response(JSON.stringify(failResult))
  }
  return new Response(JSON.stringify(successResult))
}
