import { list } from "@vercel/blob"
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
  if (sliceContains(SlicesMap[ObjType.AUDIO], ext)) {
    return ObjType.VIDEO
  }
  if (sliceContains(SlicesMap[ObjType.AUDIO], ext)) {
    return ObjType.IMAGE
  }
  if (sliceContains(SlicesMap[ObjType.AUDIO], ext)) {
    return ObjType.TEXT
  }
  return ObjType.UNKNOWN
}

export async function POST(request: Request) {
  const body = await request.json()
  let prefix = body.path.slice(1) + "/"
  if (prefix == "/") {
    prefix = ""
  }
  const response = await list({ prefix: prefix, mode: "folded" })
  // console.log(response)
  const content = response.blobs
    .filter((blob) => {
      return blob.pathname != prefix
    })
    .map((blob) => {
      const pathname = new URL(blob.url).pathname.slice(1)
      return {
        name: decodeURIComponent(pathname.split("/").pop() || ""),
        size: blob.size,
        is_dir: false,
        modified: blob.uploadedAt.toISOString(),
        created: blob.uploadedAt.toISOString(),
        sign: "",
        thumb: "",
        type: getFileType(pathname),
        hashinfo: "null",
        hash_info: null,
      }
    })
  response.folders.forEach((folder) => {
    content.push({
      name: folder.slice(prefix.length).slice(0, -1),
      size: 0,
      is_dir: true,
      modified: "",
      created: "",
      sign: "",
      thumb: "",
      type: ObjType.FOLDER,
      hashinfo: "null",
      hash_info: null,
    })
  })
  const data = {
    code: 200,
    message: "success",
    data: {
      content: content,
      total: content.length,
      readme: "",
      header: "",
      write: true,
      provider: "VercelBlob",
    },
  }

  return new Response(JSON.stringify(data))
}
