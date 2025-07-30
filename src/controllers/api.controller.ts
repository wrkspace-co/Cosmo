import { Request, Response } from 'express'
import { fetchReleases } from '../services/github.service'

export const getReleases = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const perPage = parseInt(req.query.perPage as string) || 10

  try {
    const releases = await fetchReleases(page, perPage)
    res.json({ page, perPage, count: releases.length, data: releases })
  } catch {
    res.status(500).json({ error: 'Failed to fetch releases' })
  }
}
