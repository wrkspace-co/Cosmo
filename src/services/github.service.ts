import axios from 'axios'
import { GitHubRelease } from '../types/github'

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
})

export const fetchReleases = async (page = 1, perPage = 10): Promise<GitHubRelease[]> => {
  const response = await github.get(`/repos/${process.env.GITHUB_REPO}/releases`, {
    params: { page, per_page: perPage },
  })

  return response.data
}

export const fetchReleaseByTag = async (tag: string) =>
  (await github.get(`/repos/${process.env.GITHUB_REPO}/releases/tags/${tag}`)).data

export const fetchAssetDownloadUrl = async (tag: string, assetName: string) => {
  const release = await fetchReleaseByTag(tag)
  const asset = release.assets.find((a: any) => a.name === assetName)
  if (!asset) throw new Error('Asset not found')
  return asset.browser_download_url
}
