import { Request, Response } from 'express'
import { fetchReleases } from '../services/github.service'

export const getReleases = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const perPage = parseInt(req.query.perPage as string) || 10
  const includePre = req.query.preRelease === 'true' || req.query.preRelease === '1'

  try {
    const releases = await fetchReleases(page, perPage)
    const candidates = includePre ? releases : releases.filter((rel) => rel.prerelease === false)

    res.json({ page, perPage, count: candidates.length, data: candidates })
  } catch {
    res.status(500).json({ error: 'Failed to fetch releases' })
  }
}
