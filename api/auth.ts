import { POST as hashPOST } from "../api_lib/handlers/auth/login/hash.js"

export async function POST(request: Request) {
  const pathname = new URL(request.url).pathname

  if (pathname == "/api/auth/login/hash") {
    return await hashPOST(request)
  }
  // return 404
  return new Response(null, { status: 404 })
}
