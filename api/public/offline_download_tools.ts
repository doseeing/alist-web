const data = {
  code: 200,
  message: "success",
  data: [
    "SimpleHttp",
    "pikpak",
    "qBittorrent",
    "transmission",
    "115 Cloud",
    "aria2",
  ],
}
export function GET(request: Request) {
  return new Response(JSON.stringify(data))
}
