import { ProxyAgent, setGlobalDispatcher } from "undici"

export function setupProxy() {
  if (process.env.http_proxy) {
    const proxyAgent = new ProxyAgent(process.env.http_proxy)
    setGlobalDispatcher(proxyAgent)
  }
}
