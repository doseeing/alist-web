export async function GET(request: Request) {
  // get path name from url
  let pathname = new URL(request.url).pathname
  // remove prefix /p
  pathname = pathname.slice(2)
  const url = process.env.BLOB_URL + pathname
  console.log(url)
  // get file content
  const response = await fetch(url)
  return new Response(await response.blob())
}
