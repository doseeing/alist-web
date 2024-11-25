import { getStorage } from "../../driver_route.js"

export async function POST(request: Request) {
  const body = await request.json()
  const dir = body.path

  const driver = getStorage(dir)
  if (!driver) {
    const failResult = {
      code: 400,
      message: "driver not found",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }

  const objArray = await driver.List(dir, {})

  const data = {
    code: 200,
    message: "success",
    data: {
      content: objArray,
      total: objArray.length,
      readme: "",
      header: "",
      write: true,
      provider: "VercelBlob",
    },
  }

  return new Response(JSON.stringify(data))
}
