// using edge config to store key value pairs
// you can use other persistent storage like redis, mysql, etc.
import { get as edgeConfigGet } from "@vercel/edge-config"

export async function get(key: string) {
  return await edgeConfigGet(key)
}

export async function set(key: string, value: string) {
  await updateEdgeConfig([
    {
      operation: "upsert",
      key: key,
      value: value,
    },
  ])
}

export async function del(key: string) {
  await updateEdgeConfig([
    {
      operation: "delete",
      key: key,
      value: "",
    },
  ])
}

async function updateEdgeConfig(items: any) {
  try {
    const configId = new URL(process.env.EDGE_CONFIG || "").pathname
      .split("/")
      .pop()
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${configId}/items`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items,
        }),
      },
    )
    const result = await response.json()
    // console.log(result)
  } catch (error) {
    // console.log(error)
  }
}
