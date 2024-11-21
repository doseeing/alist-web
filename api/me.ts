const data = {
  code: 200,
  message: "success",
  data: {
    id: 1,
    username: "admin",
    password: "",
    base_path: "/",
    role: 2,
    disabled: false,
    permission: 0,
    sso_id: "",
    otp: false,
  },
}

export function GET(request: Request) {
  return new Response(JSON.stringify(data))
}
