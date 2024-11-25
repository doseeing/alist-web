import { GET as offlineDownloadToolsGET } from "../api_lib/handlers/public/offline_download_tools.js"
import { GET as settingsGET } from "../api_lib/handlers/public/settings.js"

export async function GET(request: Request) {
  const pathname = new URL(request.url).pathname

  if (pathname == "/api/public/offline_download_tools") {
    return await offlineDownloadToolsGET(request)
  }

  if (pathname == "/api/public/settings") {
    return await settingsGET(request)
  }
  // return 404
  return new Response(null, { status: 404 })
}
