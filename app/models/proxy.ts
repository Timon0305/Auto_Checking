export interface ProxyGroup {
  id: string,
  name: string,
  data: string[]
}

export default interface Proxies {
  [index: number]: ProxyGroup
}
