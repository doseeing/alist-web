import {
  getStorage,
  getStorageActualPath,
  getStoragesUnder,
} from "../../driver_route.js"
import { Obj, ObjType } from "../../../src/types/obj.js"

export async function POST(request: Request) {
  const body = await request.json()
  const dir = body.path
  let objArray: Obj[] = []
  // find mount path under the path
  const mounted = getStoragesUnder(dir)
  for (const driver of mounted) {
    if (driver.mountPath === null) continue
    const name = driver.mountPath.split("/").pop() || ""
    objArray.push({
      path: "",
      name: name,
      size: 0,
      is_dir: true,
      modified: "",
      // created: "",
      sign: "",
      thumb: "",
      type: ObjType.FOLDER,
      // hashinfo: "null",
      // hash_info: null,
      // raw_url: "",
      // readme: "",
      // header: "",
      // provider: "VercelBlob",
      // related: null,
    })
  }
  // find driver responsible for the path
  const { driver, actualPath } = getStorageActualPath(dir)

  if (!driver) {
    if (objArray.length === 0) {
      const failResult = {
        code: 400,
        message: "driver not found",
        data: null,
      }
      return new Response(JSON.stringify(failResult))
    }
  } else {
    objArray = [...objArray, ...(await driver.List(actualPath, {}))]
  }

  const data = {
    code: 200,
    message: "success",
    data: {
      content: objArray,
      total: objArray.length,
      readme: "",
      header: "",
      write: true,
      provider: "",
    },
  }

  return new Response(JSON.stringify(data))
}
