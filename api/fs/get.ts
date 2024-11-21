const data = {
  code: 200,
  message: "success",
  data: {
    name: "disk",
    size: 0,
    is_dir: true,
    modified: "2024-11-20T19:39:32.040665728+08:00",
    created: "2024-11-20T19:36:48.455296102+08:00",
    sign: "",
    thumb: "",
    type: 0,
    hashinfo: "null",
    hash_info: null,
    raw_url: "",
    readme: "",
    header: "",
    provider: "Local",
    related: null,
  },
}
export function POST(request: Request) {
  return new Response(JSON.stringify(data))
}
