import { Obj } from "../../src/types/obj.js"

export interface Driver {
  List: (dir: string, args: any) => Promise<Obj[]>
  Get: (path: string) => Promise<(Obj & { raw_url: string }) | null>
  MakeDir: (parentDir: Obj, dirName: string) => Promise<void>
  Put: (dstDir: Obj, file: Blob) => Promise<void>
  Remove: (obj: Obj) => Promise<void>
}
