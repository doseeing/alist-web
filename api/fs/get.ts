import { head } from "@vercel/blob"

const folderResult = {
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

const fileResult: any = {
  code: 200,
  message: "success",
  data: {
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
    raw_url:
      "/p/%E6%8C%89%E9%87%8F%E5%92%8C%E6%8A%A2%E5%8D%A0%E5%BC%8F%E5%AE%9E%E4%BE%8B%E7%9A%84%E8%B4%B9%E7%94%A8%E6%AF%94%E8%BE%83.md?sign=Bfchmp6KGMnar88eiKycZ-BRppghpK-pwzRwPFimBzQ=:0",
    readme: "",
    header: "",
    provider: "Local",
    related: null,
  },
}
export async function POST(request: Request) {
  const body: any = await request.json()
  if (body.path === "/") {
    return new Response(JSON.stringify(folderResult))
  }
  const prefix = "https://e55pxoq9qdhbem5g.public.blob.vercel-storage.com"
  // console.log(prefix + body.path)
  const response = await head(prefix + body.path)
  const pathname = new URL(response.url).pathname.slice(1)
  const data = {
    name: pathname.split("/").pop(),
    size: 396,
    is_dir: false,
    modified: "2024-11-07T14:11:58.344+08:00",
    created: "2024-11-20T19:38:18.47825107+08:00",
    sign: "Bfchmp6KGMnar88eiKycZ-BRppghpK-pwzRwPFimBzQ=:0",
    thumb: "",
    type: 4,
    hashinfo: "null",
    hash_info: null,
    raw_url: response.url,
    readme: "",
    header: "",
    provider: "Local",
    related: null,
  }

  fileResult.data = data

  return new Response(JSON.stringify(fileResult))
}
