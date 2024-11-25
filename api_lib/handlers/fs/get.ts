import { FsGetResp } from "../../../src/types/resp.js"
import { getStorage } from "../../driver_route.js"

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

  const driver = getStorage(path)
  if (!driver) {
    const failResult = {
      code: 400,
      message: "driver not found",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }

  const obj = await driver.Get(path)

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
