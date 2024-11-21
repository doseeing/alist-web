import { list } from "@vercel/blob"
import { blob } from "stream/consumers"

const data = {
  code: 200,
  message: "success",
  data: {
    content: [
      {
        name: "Snipaste_2024-10-10_14-22-15.png",
        size: 822564,
        is_dir: false,
        modified: "2024-10-10T14:22:20.462+08:00",
        created: "2024-11-20T19:39:32.040665728+08:00",
        sign: "t4aHhFIp1Rwmi6U1hyR7E9mE2Vkpb8JabtnMg2OTZRM=:0",
        thumb: "",
        type: 5,
        hashinfo: "null",
        hash_info: null,
      },
      {
        name: "按量和抢占式实例的费用比较.md",
        size: 396,
        is_dir: false,
        modified: "2024-11-07T14:11:58.344+08:00",
        created: "2024-11-20T19:38:18.47825107+08:00",
        sign: "Bfchmp6KGMnar88eiKycZ-BRppghpK-pwzRwPFimBzQ=:0",
        thumb: "",
        type: 4,
        hashinfo: "null",
        hash_info: null,
      },
    ],
    total: 2,
    readme: "",
    header: "",
    write: true,
    provider: "Local",
  },
}
export async function POST(request: Request) {
  const body = await request.json()
  let prefix = body.path.slice(1) + "/"
  if (prefix == "/") {
    prefix = ""
  }

  const response = await list({ prefix: prefix, mode: "folded" })
  console.log(response)
  const content = response.blobs
    .filter((blob) => {
      return blob.pathname != prefix
    })
    .map((blob) => {
      const pathname = new URL(blob.url).pathname.slice(1)
      return {
        name: decodeURIComponent(pathname.split("/").pop() || ""),
        size: blob.size,
        is_dir: false,
        modified: "2024-10-10T14:22:20.462+08:00",
        created: "2024-11-20T19:39:32.040665728+08:00",
        sign: "",
        thumb: "",
        type: 5,
        hashinfo: "null",
        hash_info: null,
      }
    })
  response.folders.forEach((folder) => {
    content.push({
      name: folder.slice(prefix.length).slice(0, -1),
      size: 0,
      is_dir: true,
      modified: "2024-10-10T14:22:20.462+08:00",
      created: "2024-11-20T19:39:32.040665728+08:00",
      sign: "",
      thumb: "",
      type: 1,
      hashinfo: "null",
      hash_info: null,
    })
  })
  data.data.content = content
  return new Response(JSON.stringify(data))
}
