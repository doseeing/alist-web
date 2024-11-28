import { FsGetResp } from "../../../src/types/resp.js"
import {
  getStorage,
  getStorageActualPath,
  getStoragesUnder,
} from "../../driver_route.js"
import { ObjType } from "../../../src/types/obj.js"

export async function POST(request: Request) {
  const body: any = await request.json()
  const path = body.path
  if (!path) {
    const failResult = {
      code: 400,
      message: "path is required",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }

  const { driver, actualPath } = getStorageActualPath(path)
  if (!driver) {
    // check if included mount point
    const mounted = getStoragesUnder(path)
    const name = path.split("/").pop() || ""

    if (mounted.length > 0) {
      const result = {
        code: 200,
        message: "success",
        data: {
          path: "",
          name: name,
          size: 0,
          is_dir: true,
          modified: "",
          // created: "",
          sign: "",
          thumb: "",
          type: ObjType.UNKNOWN,
          // hashinfo: "null",
          // hash_info: null,
          raw_url: "",
          // readme: "",
          // header: "",
          // provider: "VercelBlob",
          // related: null,
        },
      }
      return new Response(JSON.stringify(result))
    }

    const failResult = {
      code: 400,
      message: "driver not found",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }

  const origin = new URL(request.url).origin
  const obj = await driver.Get(actualPath, { origin })

  if (!obj) {
    const result = {
      code: 404,
      message: "file not found",
      data: null,
    }
    return new Response(JSON.stringify(result))
  }

  const result: FsGetResp = {
    code: 200,
    message: "success",
    data: {
      ...obj,
      raw_url: obj.raw_url,
      readme: "",
      header: "",
      provider: "VercelBlob",
      related: [],
    },
  }

  return new Response(JSON.stringify(result))
}
