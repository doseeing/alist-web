import VercelBlob from "../../drivers/vercel_blob.js"
import { ObjType } from "../../../src/types/obj.js"

export async function POST(request: Request) {
  const body = await request.json()
  const filePath = body.path

  if (!filePath) {
    return new Response("File Path header is required", { status: 400 })
  }

  const driver = new VercelBlob()
  const parentDir = filePath.split("/").slice(0, -1).join("/")
  const dir = filePath.split("/").pop()
  await driver.MakeDir(
    {
      path: parentDir,
      name: "",
      size: 0,
      is_dir: true,
      modified: "",
      sign: "",
      thumb: "",
      type: ObjType.FOLDER,
    },
    dir,
  )
  const data = {
    code: 200,
    message: "success",
    data: null,
  }

  return new Response(JSON.stringify(data))
}
