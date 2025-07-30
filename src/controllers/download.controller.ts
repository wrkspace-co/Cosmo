import { Request, Response } from 'express'
import { UAParser } from 'ua-parser-js'
import { findLastRelease } from '../services/github.service'

export const handleDownload = async (req: Request, res: Response) => {
  const ua = UAParser(req.get('User-Agent') || '')
  const osName = ua.os.name?.toLowerCase() || ''
  const arch = ua.cpu.architecture || ''

  const ext = osName.includes('mac') ? 'dmg' : osName.includes('windows') ? 'exe' : 'AppImage'
  const release = await findLastRelease()

  if (!release) return res.status(404).json({ message: 'No releases found' })

  const asset = release.assets.find(
    (a) =>
      a.name.toLowerCase().includes(arch.toLowerCase()) && a.name.toLowerCase().endsWith(`.${ext}`),
  )

  if (!asset) return res.status(404).json({ message: `No installer for ${osName}/${arch}` })

  res.redirect(asset.browser_download_url)
}
