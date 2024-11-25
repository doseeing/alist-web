import VercelBlob from "../../drivers/vercel_blob.js"

export async function POST(request: Request) {
  const body = await request.json()
  const dir = body.path

  const driver = new VercelBlob()
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
