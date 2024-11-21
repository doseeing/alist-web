import { list } from "@vercel/blob"

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
  const response = await list()
  // console.log(response.blobs)
  const content = response.blobs.map((blob) => {
    const isDir = blob.pathname.endsWith("/")
    return {
      name: isDir ? blob.pathname.slice(0, -1) : blob.pathname,
      size: blob.size,
      is_dir: isDir,
      modified: "2024-10-10T14:22:20.462+08:00",
      created: "2024-11-20T19:39:32.040665728+08:00",
      sign: "",
      thumb: "",
      type: isDir ? 1 : 5,
      hashinfo: "null",
      hash_info: null,
    }
  })
  data.data.content = content
  return new Response(JSON.stringify(data))
}
