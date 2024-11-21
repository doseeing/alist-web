import { put } from "@vercel/blob"
const data = {
  code: 200,
  message: "success",
  data: {
    task: {
      id: "sdH2LbjyWRk",
      name: "upload animated_zoom.gif to [/data](/alist)",
      state: 0,
      status: "uploading",
      progress: 0,
      error: "",
    },
  },
}
export async function PUT(request: Request) {
  const filePath = request.headers.get("File-Path")
  const fileContent = await request.blob()
  if (!filePath) {
    return new Response("File-Path header is required", { status: 400 })
  }
  const blob = await put(filePath, fileContent, {
    access: "public",
    addRandomSuffix: false,
  })

  return new Response("")
}
