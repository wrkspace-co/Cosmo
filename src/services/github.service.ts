import axios from 'axios'
import { GitHubRelease } from '../types/github'
import semver from 'semver'

export const tokenHeader = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
}

export const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    ...tokenHeader,
    Accept: 'application/vnd.github.v3+json',
  },
})

export const fetchReleases = async (page = 1, perPage = 10): Promise<GitHubRelease[]> => {
  const response = await github.get(`/repos/${process.env.GITHUB_REPO}/releases`, {
    params: { page, per_page: perPage },
  })

  return response.data
}

export async function findLastRelease(includePre: boolean = false) {
  const releases = await fetchReleases(1, 100)
  // If includePre is false, drop any prerelease entries
  const candidates = includePre ? releases : releases.filter((rel) => rel.prerelease === false)
  // Return the very first (newest) of those
  return candidates[0] ?? null
}

export async function findNextRelease(clientVersion: string, includePre: boolean = false) {
  const releases = await fetchReleases(1, 100)
  return (
    releases
      // 1) Filter out prereleases if not requested
      .filter((rel) => (includePre ? true : rel.prerelease === false))
      // 2) Normalize tag_name and compare semver
      .find((rel) => {
        const tag = rel.tag_name.replace(/^v/, '')
        return semver.valid(tag) && semver.valid(clientVersion) && semver.gt(tag, clientVersion)
      }) || null
  )
}
