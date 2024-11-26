export type Link = {
  URL: string
  Header: Record<string, string>
  // RangeReadCloser RangeReadCloserIF `json:"-"`      // recommended way if can't use URL
  // MFile           File              `json:"-"`      // best for local,smb... file system, which exposes MFile

  // Expiration *time.Duration // local cache expire Duration
  // IPCacheKey bool           `json:"-"` // add ip to cache key

  // //for accelerating request, use multi-thread downloading
  // Concurrency int `json:"concurrency"`
  // PartSize    int `json:"part_size"`
}
