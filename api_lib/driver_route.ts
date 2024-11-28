import { Driver } from "./drivers/base.js"
import VercelBlob from "./drivers/vercel_blob.js"
import GoogleDrive from "./drivers/google_drive.js"
import { getParentDir } from "./utils.js"

export function getStorage(path: string): Driver | null {
  const allDrivers = [VercelBlob, GoogleDrive]
  const mountPathList = allDrivers.map((driver) => new driver().mountPath)
  for (let i = 0; i < allDrivers.length; i++) {
    const mountPath = mountPathList[i]
    if (mountPath === null) {
      continue
    }
    if (path.startsWith(mountPath)) {
      return new allDrivers[i]()
    }
  }

  return null
}

export function getStoragesUnder(dir: string): Driver[] {
  const allDrivers = [VercelBlob, GoogleDrive]
  const mountPathList = allDrivers.map((driver) => new driver().mountPath)
  const result = []
  for (let i = 0; i < allDrivers.length; i++) {
    const mountPath = mountPathList[i]
    if (mountPath === null) {
      continue
    }
    if (getParentDir(mountPath) === dir) {
      result.push(new allDrivers[i]())
    }
  }

  return result
}

export function getStorageActualPath(path: string): {
  driver: Driver | null
  actualPath: string
} {
  const storage = getStorage(path)
  let actualPath = path.replace(storage?.mountPath || "", "")
  if (actualPath === "") {
    actualPath = "/"
  }
  return { driver: storage, actualPath: actualPath }
}
