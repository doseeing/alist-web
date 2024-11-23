import { del } from "@vercel/blob"

export async function POST(request: Request) {
  const body = await request.json()
  const dir = body.dir
  const names = body.names

  for (const name of names) {
    const url = process.env.BLOB_URL + dir + "/" + name
    await del(url)
  }
  const data = {
    code: 200,
    message: "success",
    data: null,
  }
  return new Response(JSON.stringify(data))
}
