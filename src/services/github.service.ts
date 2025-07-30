import axios from 'axios'
import { GitHubRelease } from '../types/github'
import semver from 'semver'

export const tokenHeader = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
}

const github = axios.create({
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

export async function findLastRelease() {
  const releases = await fetchReleases(1, 1)
  return releases[0] ?? null
}

export async function findNextRelease(clientVersion: string) {
  const releases = await fetchReleases(1, 100)
  return (
    releases.find((rel) => {
      const tag = rel.tag_name.replace(/^v/, '')
      return semver.valid(tag) && semver.valid(clientVersion) && semver.gt(tag, clientVersion)
    }) || null
  )
}
