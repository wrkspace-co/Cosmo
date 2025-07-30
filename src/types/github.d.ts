export interface ReleaseAsset {
  url: string
  id: number
  node_id: string
  name: string
  label: string | null
  content_type: string
  state: string
  size: number
  digest?: string
  download_count: number
  browser_download_url: string
  created_at: string
  updated_at: string
  [key: string]: unknown
}

export interface ReleaseAuthor {
  login: string
  id: number
  node_id: string
  avatar_url: string
  html_url: string
  type: string
  site_admin: boolean
  [key: string]: unknown
}

export interface GitHubRelease {
  url: string
  assets_url: string
  upload_url: string
  html_url: string
  id: number
  author: ReleaseAuthor
  tag_name: string
  target_commitish: string
  name: string
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string
  assets: ReleaseAsset[]
  body?: string
  [key: string]: unknown
}

export interface ReleasesResponse {
  page: number
  perPage: number
  count: number
  data: GitHubRelease[]
}
