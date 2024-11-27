import { getStorage } from "../../driver_route.js"
import { ObjType } from "../../../src/types/obj.js"

export async function PUT(request: Request) {
  const filePath = decodeURIComponent(request.headers.get("File-Path") || "")
  const mimeType = request.headers.get("Content-Type")
  let fileContent = await request.blob()

  if (fileContent.size === 0) {
    // not support empty blob
    fileContent = new Blob([" "])
  }
  if (!filePath) {
    return new Response("File-Path header is required", { status: 400 })
  }

  const driver = getStorage(filePath)
  if (!driver) {
    const failResult = {
      code: 400,
      message: "driver not found",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }
  const name = filePath.split("/").pop() || ""
  await driver.Put(
    {
      path: filePath,
      name: name,
      size: 0,
      is_dir: true,
      modified: "",
      sign: "",
      thumb: "",
      type: ObjType.FOLDER,
    },
    fileContent,
    { mimeType: mimeType || "" },
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
