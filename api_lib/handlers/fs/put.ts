import VercelBlob from "../../drivers/vercel_blob.js"
import { ObjType } from "../../../src/types/obj.js"

export async function PUT(request: Request) {
  const filePath = request.headers.get("File-Path")
  const fileContent = await request.blob()
  if (!filePath) {
    return new Response("File-Path header is required", { status: 400 })
  }

  const driver = new VercelBlob()
  await driver.Put(
    {
      path: filePath,
      name: "",
      size: 0,
      is_dir: true,
      modified: "",
      sign: "",
      thumb: "",
      type: ObjType.FOLDER,
    },
    fileContent,
  )
  const data = {
    code: 200,
    message: "success",
    data: {
      task: {
        id: "",
        name: "upload animated_zoom.gif to [/data](/alist)",
        state: 0,
        status: "uploading",
        progress: 0,
        error: "",
      },
    },
  }

  return new Response(JSON.stringify(data))
}
