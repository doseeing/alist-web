import { getStorageActualPath } from "../../driver_route.js"
import { ObjType } from "../../../src/types/obj.js"

export async function POST(request: Request) {
  const body = await request.json()
  let dir = body.dir
  const names = body.names

  for (const name of names) {
    const { driver, actualPath } = getStorageActualPath(dir + "/" + name)
    if (!driver) {
      continue
    }
    await driver.Remove({
      path: actualPath,
      name: "",
      size: 0,
      is_dir: true,
      modified: "",
      sign: "",
      thumb: "",
      type: ObjType.FOLDER,
    })
  }
  const data = {
    code: 200,
    message: "success",
    data: null,
  }
  return new Response(JSON.stringify(data))
}
