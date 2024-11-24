import { list } from "@vercel/blob"
import { getFileType, ObjType } from "../../filetypes.js"

export async function POST(request: Request) {
  const body = await request.json()
  let prefix = body.path.slice(1) + "/"
  if (prefix == "/") {
    prefix = ""
  }

  const response = await list({ prefix: prefix, mode: "folded" })
  // console.log(response)
  const content = response.blobs
    .filter((blob) => {
      return blob.pathname != prefix
    })
    .map((blob) => {
      const pathname = new URL(blob.url).pathname.slice(1)
      return {
        name: decodeURIComponent(pathname.split("/").pop() || ""),
        size: blob.size,
        is_dir: false,
        modified: blob.uploadedAt.toISOString(),
        created: blob.uploadedAt.toISOString(),
        sign: "",
        thumb: "",
        type: getFileType(pathname),
        hashinfo: "null",
        hash_info: null,
      }
    })
  response.folders.forEach((folder) => {
    content.push({
      name: folder.slice(prefix.length).slice(0, -1),
      size: 0,
      is_dir: true,
      modified: "",
      created: "",
      sign: "",
      thumb: "",
      type: ObjType.FOLDER,
      hashinfo: "null",
      hash_info: null,
    })
  })
  const data = {
    code: 200,
    message: "success",
    data: {
      content: content,
      total: content.length,
      readme: "",
      header: "",
      write: true,
      provider: "VercelBlob",
    },
  }

  return new Response(JSON.stringify(data))
}
