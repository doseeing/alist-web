import { Obj, ObjType } from "../../src/types/obj.js"
import { Link } from "../types"
import { Driver } from "./base"

export default class Dumb implements Driver {
  mountPath: string | null = "/dumb"
  List = async (dir: string, args: any): Promise<Obj[]> => {
    // Implementation for listing objects in a virtual directory
    return [
      {
        name: "readme.md",
        size: 100,
        is_dir: false,
        modified: "",
        thumb: "",
        type: ObjType.TEXT,
        path: "",
      },
    ]
  }

  Get = async (
    path: string,
    args: any,
  ): Promise<(Obj & { raw_url: string }) | null> => {
    // Implementation for getting an object from a virtual path
    if (path === "/") {
      return {
        name: "disk",
        size: 0,
        is_dir: true,
        modified: "",
        thumb: "",
        type: ObjType.FOLDER,
        path: "",
        raw_url: "",
      }
    }
    if (path === "/readme.md") {
      return {
        name: "readme.md",
        size: 100,
        is_dir: false,
        modified: "",
        thumb: "",
        type: ObjType.TEXT,
        path: "",
        raw_url: `${args.origin}/p${this.mountPath}${path}`,
      }
    }
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
    if (file.path === "/readme.md") {
      return {
        URL: `${args.origin}/p${this.mountPath}${file.path}`,
        Header: {},
        Data: new Blob([
          "## Dumb Driver\n\nThis is a dumb driver for testing purposes.",
        ]),
      }
    }
    return { URL: "", Header: {} }
  }
}
