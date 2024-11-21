const prefix = "https://e55pxoq9qdhbem5g.public.blob.vercel-storage.com"

export async function GET(request: Request) {
  // get path name from url
  let pathname = new URL(request.url).pathname
  // remove prefix /p
  pathname = pathname.slice(2)
  const url = prefix + pathname
  // get file content
  const response = await fetch(url)
  return new Response(await response.blob())
}
