import { head } from "@vercel/blob"
export enum ObjType {
  UNKNOWN,
  FOLDER,
  // OFFICE,
  VIDEO,
  AUDIO,
  TEXT,
  IMAGE,
}

const SlicesMap = {
  [ObjType.AUDIO]: "mp3,flac,ogg,m4a,wav,opus,wma".split(","),
  [ObjType.VIDEO]: "mp4,mkv,avi,mov,rmvb,webm,flv,m3u8".split(","),
  [ObjType.IMAGE]: "jpg,tiff,jpeg,png,gif,bmp,svg,ico,swf,webp".split(","),
  [ObjType.TEXT]:
    "txt,htm,html,xml,java,properties,sql,js,md,json,conf,ini,vue,php,py,bat,gitignore,yml,go,sh,c,cpp,h,hpp,tsx,vtt,srt,ass,rs,lrc".split(
      ",",
    ),
}
function sliceContains(slice: string[], value?: string) {
  if (!value) return false
  return slice.includes(value)
}
export function getFileType(filename: string) {
  const ext = filename.split(".").pop()
  if (sliceContains(SlicesMap[ObjType.AUDIO], ext)) {
    return ObjType.AUDIO
  }
  if (sliceContains(SlicesMap[ObjType.VIDEO], ext)) {
    return ObjType.VIDEO
  }
  if (sliceContains(SlicesMap[ObjType.IMAGE], ext)) {
    return ObjType.IMAGE
  }
  if (sliceContains(SlicesMap[ObjType.TEXT], ext)) {
    return ObjType.TEXT
  }
  return ObjType.UNKNOWN
}

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
