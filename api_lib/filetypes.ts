import { ObjType } from "../src/types/obj.js"

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
