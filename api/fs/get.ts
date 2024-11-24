import { head } from "@vercel/blob"
import { getFileType, ObjType } from "../../_lib/filetypes.js"

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

  const response = await head(process.env.BLOB_URL + body.path)

  const pathname = new URL(response.url).pathname.slice(1)
  const modified = response.uploadedAt.toISOString()
  const data = {
    name: decodeURIComponent(pathname.split("/").pop() || ""),
    size: response.size,
    is_dir: false,
    modified: modified,
    created: modified,
    sign: "",
    thumb: "",
    type: getFileType(pathname),
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
