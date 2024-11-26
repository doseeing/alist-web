import { ObjType, Obj } from "../../src/types/obj.js"
import { getFileType } from "../filetypes.js"
import { Driver } from "./base.js"
import { setupProxy } from "../dev.js"
import { get, set } from "../kv.js"

type File = {
  id: string
  name: string
  mimeType: string
  size: number
  modifiedTime: string
  createdTime: string
  thumbnailLink: string
  shortcutDetails: any
  md5Checksum: string
  sha1Checksum: string
  sha256Checksum: string
}
export default class GoogleDrive implements Driver {
  constructor() {
    setupProxy()
  }
  async refreshToken() {
    const url = "https://www.googleapis.com/oauth2/v4/token"
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

  fileToObj(file: File): Obj {
    return {
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
    }
  }
  async ApiList(fileId: string): Promise<File[]> {
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
    return data.files
  }
  async getFiles(dir: string): Promise<File[]> {
    const segments = dir === "/" ? [""] : dir.split("/")
    let fileId = process.env.GOOGLE_ROOT_FILE_ID || ""
    let files: File[] = []
    while (segments.length > 0) {
      files = await this.ApiList(fileId)
      segments.shift()
      if (segments.length > 0) {
        const name = decodeURIComponent(segments[0])

        const file = files.find((f) => f.name === name)
        if (file) {
          fileId = file.id
        } else {
          return []
        }
      }
    }
    return files
  }

  async List(dir: string, args: any): Promise<Obj[]> {
    return (await this.getFiles(dir)).map(this.fileToObj)
  }

  async ApiGet(path: string): Promise<File | undefined> {
    const parentDir = path.split("/").slice(0, -1).join("/")
    let fileName = path.split("/").pop() || ""
    const files = await this.getFiles(parentDir)
    fileName = decodeURIComponent(fileName)
    const file = files.find((f) => f.name === fileName)
    return file
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
    // list parent dir to get file info
    const parentDir = path.split("/").slice(0, -1).join("/")
    const fileName = path.split("/").pop()
    const files = await this.List(parentDir, {})
    const file = files.find((f) => f.name === fileName)
    if (file) {
      return {
        ...file,
        raw_url:
          file.type === ObjType.IMAGE ? file.thumb : `${args.origin}/p${path}`,
      }
    }
    return null
  }

  async MakeDir(parentDir: Obj, dirName: string) {}

  async Put(dstDir: Obj, file: Blob) {}

  async Remove(obj: Obj) {}

  async Link(file: Obj, args: any) {
    const info = await this.ApiGet(file.path)
    const base = args.base
    if (!info) {
      return {
        URL: "",
        Header: {
          Authorization: "",
        },
      }
    }
    return {
      URL:
        `https://www.googleapis.com/drive/v3/files/${info.id}?includeItemsFromAllDrives=true&supportsAllDrives=true` +
        "&alt=media&acknowledgeAbuse=true",
      Header: {
        Authorization: `Bearer ${await get("google_drive_access_token")}`,
      },
    }
  }
}
