import { getStorage } from "../api_lib/driver_route.js"

export async function GET(request: Request) {
  // get path name from url
  let pathname = new URL(request.url).pathname
  // remove prefix /p
  pathname = pathname.slice(2)

  const driver = getStorage(pathname)
  if (driver === null) {
    return new Response("Not Found", { status: 404 })
  }

  const link = await driver.Link(
    {
      path: pathname,
      name: "",
      size: 0,
      is_dir: false,
      modified: "",
      sign: "",
      thumb: "",
      type: 0,
    },
    {},
  )
  if (link.URL === "") {
    return new Response("Not Found", { status: 404 })
  }
  // get file content
  const response = await fetch(link.URL, { headers: link.Header })
  const result = new Response(await response.blob())
  result.headers.set("Access-Control-Allow-Origin", "*")
  return result
}
