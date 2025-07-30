import os from 'os'
import { Request, Response } from 'express'
import { fetchReleaseByTag } from '../services/github.service'

export const handleDownload = async (_req: Request, res: Response) => {
  const platform = os.platform()
  const arch = os.arch()
  const ext = platform === 'darwin' ? 'dmg' : platform === 'win32' ? 'exe' : 'AppImage'
  const tag = 'latest'
  const release = await fetchReleaseByTag(tag)
  const filename = `YourApp-${platform}-${arch}.${ext}`
  const asset = release.assets.find((a: any) => a.name === filename)

  if (!asset) return res.status(404).json({ message: 'Installer not found' })

  res.redirect(asset.browser_download_url)
}
