import { Driver } from "./drivers/base.js"
// import VercelBlob from "./drivers/vercel_blob.js"
import GoogleDrive from "./drivers/google_drive.js"

export function getStorage(path: string): Driver | null {
  return new GoogleDrive()
}
