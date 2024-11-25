import { head } from "@vercel/blob"
import { getFileType, ObjType } from "../../filetypes.js"

const rootResult = {
  code: 200,
  message: "success",
  data: {
    name: "disk",
    size: 0,
    is_dir: true,
    modified: "",
    created: "",
    sign: "",
    thumb: "",
    type: ObjType.UNKNOWN,
    hashinfo: "null",
    hash_info: null,
    raw_url: "",
    readme: "",
    header: "",
    provider: "VercelBlob",
    related: null,
  },
}

export async function POST(request: Request) {
  const body: any = await request.json()
  if (body.path === "/") {
    return new Response(JSON.stringify(rootResult))
  }
  let response = null
  let success = false
  try {
    response = await head(process.env.BLOB_URL + body.path)
  } catch (e) {}
  if (!success) {
    try {
      response = await head(process.env.BLOB_URL + body.path + "/")
    } catch (e) {}
  }
  if (!response) {
    const failResult = {
      code: 404,
      message: "file not found",
      data: null,
    }
    return new Response(JSON.stringify(failResult))
  }

  const pathname = new URL(response.url).pathname.slice(1)
  const modified = response.uploadedAt.toISOString()
  const isDir = response.contentType == "application/x-directory"
  const data = {
    name: decodeURIComponent(pathname.split("/").pop() || ""),
    size: response.size,
    is_dir: isDir,
    modified: modified,
    created: modified,
    sign: "",
    thumb: "",
    type: isDir ? ObjType.FOLDER : getFileType(pathname),
    hashinfo: "null",
    hash_info: null,
    raw_url: response.url,
    readme: "",
    header: "",
    provider: "VercelBlob",
    related: null,
  }
  const fileResult: any = {
    code: 200,
    message: "success",
    data: data,
  }

  return new Response(JSON.stringify(fileResult))
}
