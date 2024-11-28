import { getStorageActualPath } from "../../driver_route.js"
import { ObjType } from "../../../src/types/obj.js"
import { getParentDir } from "../../utils.js"

export async function POST(request: Request) {
  const body = await request.json()
  const filePath = body.path

  if (!filePath) {
    return new Response("File Path header is required", { status: 400 })
  }

  const { driver, actualPath } = getStorageActualPath(filePath)

  if (!driver) {
    const failResult = {
      code: 400,
      message: "driver not found",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }

  const parentDir = getParentDir(actualPath)
  const dir = actualPath.split("/").pop() || ""
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
