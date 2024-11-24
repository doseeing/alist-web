import { getStorage } from "../../driver_route.js"
import { ObjType } from "../../../src/types/obj.js"

export async function POST(request: Request) {
  const body = await request.json()
  let dir = body.dir
  if (dir === "/") {
    dir = ""
  }
  const driver = getStorage(dir)
  if (!driver) {
    const failResult = {
      code: 400,
      message: "driver not found",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }

  const names = body.names
  for (const name of names) {
    await driver.Remove({
      path: dir + "/" + name,
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
