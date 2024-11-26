import { ObjType, Obj } from "../../src/types/obj.js"
import { getFileType } from "../filetypes.js"
import { Driver } from "./base.js"
import { setupProxy } from "../dev.js"
import { get, set } from "../kv.js"

type ObjWithId = Obj & { id: string }
export default class GoogleDrive implements Driver {
  async refreshToken() {
    const url = "https://www.googleapis.com/oauth2/v4/token"
    setupProxy()
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN || "",
        grant_type: "refresh_token",
      }),
    })
    const data = await response.json()
    return data.access_token
  }

  async request(url: string) {
    setupProxy()
    const accessToken = await get("google_drive_access_token")
    if (accessToken === undefined) {
      const accessToken = await this.refreshToken()
      await set("google_drive_access_token", accessToken)
    }
    const url2 = url as string

    let response = await fetch(url2, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    let data = await response.json()
    if (data.error && data.error.code === 401) {
      console.log("refreshing token")
      const accessToken = await this.refreshToken()

      await set("google_drive_access_token", accessToken)
      response = await fetch(url2, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      data = await response.json()
    }
    return data
  }

  async _List(fileId: string): Promise<ObjWithId[]> {
    const query = {
      orderBy: "folder,name,modifiedTime desc",
      fields:
        "files(id,name,mimeType,size,modifiedTime,createdTime,thumbnailLink,shortcutDetails,md5Checksum,sha1Checksum,sha256Checksum),nextPageToken",
      pageSize: "1000",
      q: `'${fileId}' in parents and trashed = false`,
      includeItemsFromAllDrives: "true",
      supportsAllDrives: "true",
      //   pageToken: "first",
    }
    const url = "https://www.googleapis.com/drive/v3/files"
    const url2 = (url + "?" + new URLSearchParams(query).toString()) as string

    const data = await this.request(url2)
    const content: ObjWithId[] = []

    data.files.forEach((file: any) => {
      content.push({
        id: file.id,
        path: "",
        name: file.name,
        size: file.size,
        is_dir: file.mimeType == "application/vnd.google-apps.folder",
        modified: file.modifiedTime,
        // created: file.createdTime,
        sign: "",
        thumb: file.thumbnailLink,
        type:
          file.mimeType == "application/vnd.google-apps.folder"
            ? ObjType.FOLDER
            : getFileType(file.name),
        // hashinfo: "null",
        // hash_info: null,
      })
    })
    return content
  }
  async List(dir: string, args: any): Promise<Obj[]> {
    setupProxy()
    const segments = dir === "/" ? [""] : dir.split("/")
    let fileId = process.env.GOOGLE_ROOT_FILE_ID || ""
    let result: ObjWithId[] = []
    while (segments.length > 0) {
      result = await this._List(fileId)
      segments.shift()
      if (segments.length > 0) {
        const name = segments[0]

        const file = result.find((f) => f.name === name)
        if (file) {
          fileId = file.id
        } else {
          return []
        }
      }
    }

    return result
  }

  async Get(path: string): Promise<(Obj & { raw_url: string }) | null> {
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
    // list parent dir to get file info
    const parentDir = path.split("/").slice(0, -1).join("/")
    const fileName = path.split("/").pop()
    const files = await this.List(parentDir, {})
    const file = files.find((f) => f.name === fileName)
    if (file) {
      return {
        ...file,
        raw_url: "",
      }
    }
    return null
  }

  async MakeDir(parentDir: Obj, dirName: string) {}

  async Put(dstDir: Obj, file: Blob) {}

  async Remove(obj: Obj) {}
}
