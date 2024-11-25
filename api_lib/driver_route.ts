import { Driver } from "./drivers/base.js"
import VercelBlob from "./drivers/vercel_blob.js"

export function getStorage(path: string): Driver | null {
  return new VercelBlob()
}
