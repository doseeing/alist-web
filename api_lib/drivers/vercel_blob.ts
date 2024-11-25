import { list } from "@vercel/blob"
import { getFileType } from "../filetypes.js"
import { ObjType, Obj } from "../../src/types/obj.js"

export default class VercelBlob {
  async List(dir: string, args: any): Promise<Obj[]> {
    let prefix = dir.slice(1) + "/"
    if (prefix == "/") {
      prefix = ""
    }
    const response = await list({ prefix: prefix, mode: "folded" })
    const content: Obj[] = []
    response.blobs
      .filter((blob) => {
        return blob.pathname != prefix
      })
      .forEach((blob) => {
        const pathname = new URL(blob.url).pathname.slice(1)
        content.push({
          path: "",
          name: decodeURIComponent(pathname.split("/").pop() || ""),
          size: blob.size,
          is_dir: false,
          modified: blob.uploadedAt.toISOString(),
          //   created: blob.uploadedAt.toISOString(),
          sign: "",
          thumb: "",
          type: getFileType(pathname),
          //   hashinfo: "null",
          //   hash_info: null,
        })
      })
    response.folders.forEach((folder) => {
      content.push({
        path: "",
        name: folder.slice(prefix.length).slice(0, -1),
        size: 0,
        is_dir: true,
        modified: "",
        // created: "",
        sign: "",
        thumb: "",
        type: ObjType.FOLDER,
        // hashinfo: "null",
        // hash_info: null,
      })
    })
    return content
  }
}
