import { put } from "@vercel/blob"

export async function POST(request: Request) {
  const body = await request.json()
  const filePath = body.path

  if (!filePath) {
    return new Response("File Path header is required", { status: 400 })
  }
  const blob = await put(filePath + "/", new Blob(), {
    access: "public",
    addRandomSuffix: false,
  })
  const data = {
    code: 200,
    message: "success",
    data: null,
  }

  return new Response(JSON.stringify(data))
}
