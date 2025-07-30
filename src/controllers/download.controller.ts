import { Request, Response } from 'express'
import { UAParser } from 'ua-parser-js'
import { findLastRelease } from '../services/github.service'

export const handleDownload = async (req: Request, res: Response) => {
  const includePre = req.query.preRelease === 'true'

  const parser = new UAParser(req.get('User-Agent') || '')
  const osName = parser.getOS().name?.toLowerCase() || ''
  const arch = parser.getCPU().architecture || ''

  const ext = osName.includes('mac') ? 'dmg' : osName.includes('windows') ? 'exe' : 'AppImage'

  const release = await findLastRelease(includePre)
  if (!release) {
    return res.status(404).json({ message: 'No releases found' })
  }

  const asset = release.assets.find(
    (a) =>
      a.name.toLowerCase().includes(arch.toLowerCase()) && a.name.toLowerCase().endsWith(`.${ext}`),
  )

  if (!asset) {
    return res.status(404).json({ message: `No installer for ${osName}/${arch}` })
  }

  return res.redirect(asset.browser_download_url)
}
