import { list, head, put, del } from "@vercel/blob"

import { ObjType, Obj } from "../../src/types/obj.js"
import { getFileType } from "../filetypes.js"
import { Driver } from "./base.js"

export default class VercelBlob implements Driver {
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

  async Get(
    path: string,
    args: any,
  ): Promise<(Obj & { raw_url: string }) | null> {
    if (path === "/") {
      return {
        path: "",
        name: "disk",
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
      }
    }
    let response = null
    let success = false
    try {
      response = await head(process.env.BLOB_URL + path)
    } catch (e) {}
    if (!success) {
      try {
        response = await head(process.env.BLOB_URL + path + "/")
      } catch (e) {}
    }
    if (!response) {
      return null
    }

    const pathname = new URL(response.url).pathname.slice(1)
    const modified = response.uploadedAt.toISOString()
    const isDir = response.contentType == "application/x-directory"
    return {
      path: "",
      name: decodeURIComponent(pathname.split("/").pop() || ""),
      size: response.size,
      is_dir: isDir,
      modified: modified,
      //   created: modified,
      sign: "",
      thumb: "",
      type: isDir ? ObjType.FOLDER : getFileType(pathname),
      //   hashinfo: "null",
      //   hash_info: null,
      raw_url: response.url,
      //   readme: "",
      //   header: "",
      //   provider: "VercelBlob",
      //   related: null,
    }
  }

  async MakeDir(parentDir: Obj, dirName: string) {
    const path = parentDir.path + "/" + dirName
    await put(path + "/", new Blob(), {
      access: "public",
      addRandomSuffix: false,
    })
  }

  async Put(file: Obj, data: Blob, args: any) {
    await put(file.path, data, {
      access: "public",
      addRandomSuffix: false,
    })
  }

  async Remove(obj: Obj) {
    let url = process.env.BLOB_URL + obj.path
    await del(url)
    // in case of directory
    await del(url + "/")
  }

  async Link(file: Obj, args: any) {
    const path = file.path
    const url = process.env.BLOB_URL + path
    return {
      URL: url,
      Header: {},
    }
  }
}
