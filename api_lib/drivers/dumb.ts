import { Obj } from "~/types"
import { Link } from "../types"
import { Driver } from "./base"

export default class Dumb implements Driver {
  List = async (dir: string, args: any): Promise<Obj[]> => {
    // Implementation for listing objects in a virtual directory
    return []
  }

  Get = async (
    path: string,
    args: any,
  ): Promise<(Obj & { raw_url: string }) | null> => {
    // Implementation for getting an object from a virtual path
    return null
  }

  MakeDir = async (parentDir: Obj, dirName: string): Promise<void> => {
    // Implementation for making a directory in a virtual file system
  }

  Put = async (file: Obj, bin: Blob, args: any): Promise<void> => {
    // Implementation for putting a file in a virtual file system
  }

  Remove = async (obj: Obj): Promise<void> => {
    // Implementation for removing an object from a virtual file system
  }

  Link = async (file: Obj, args: any): Promise<Link> => {
    // Implementation for creating a link to a file in a virtual file system
    return { URL: "", Header: {} }
  }
}
