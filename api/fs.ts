import { POST as getPOST } from "../api_lib/handlers/fs/get.js"
import { POST as listPOST } from "../api_lib/handlers/fs/list.js"
import { POST as mkdirPOST } from "../api_lib/handlers/fs/mkdir.js"
import { POST as removePOST } from "../api_lib/handlers/fs/remove.js"
import { PUT as putPUT } from "../api_lib/handlers/fs/put.js"

export async function POST(request: Request) {
  const pathname = new URL(request.url).pathname

  if (pathname == "/api/fs/get") {
    return await getPOST(request)
  }
  if (pathname == "/api/fs/list") {
    return await listPOST(request)
  }
  if (pathname == "/api/fs/mkdir") {
    return await mkdirPOST(request)
  }
  if (pathname == "/api/fs/remove") {
    return await removePOST(request)
  }
  // return 404
  return new Response(null, { status: 404 })
}

export async function PUT(request: Request) {
  const pathname = new URL(request.url).pathname

  if (pathname == "/api/fs/put") {
    return await putPUT(request)
  }

  // return 404
  return new Response(null, { status: 404 })
}
