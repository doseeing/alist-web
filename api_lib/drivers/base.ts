import { Obj } from "../../src/types/obj.js"
import { Link } from "../types.js"
export interface Driver {
  List: (dir: string, args: any) => Promise<Obj[]>
  Get: (path: string, args: any) => Promise<(Obj & { raw_url: string }) | null>
  MakeDir: (parentDir: Obj, dirName: string) => Promise<void>
  Put: (file: Obj, bin: Blob, args: any) => Promise<void>
  Remove: (obj: Obj) => Promise<void>
  Link: (file: Obj, args: any) => Promise<Link>
}
