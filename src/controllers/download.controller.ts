import { Request, Response } from 'express'
import { UAParser } from 'ua-parser-js'
import { findLastRelease, github } from '../services/github.service'
import { AxiosResponse } from 'axios'
import Stream from 'stream'

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

export const handleDownloadByAssetId = async (req: Request, res: Response, next: Function) => {
  try {
    const ghRes: AxiosResponse<Stream.Readable> = await github.get(
      `/repos/${process.env.GITHUB_REPO}/releases/assets/${req.params.assetId}`,
      {
        headers: { Accept: 'application/octet-stream' },
        responseType: 'stream',
      }
    )

    const { 
      'content-type': contentType, 
      'content-length': contentLength,
      'content-disposition': contentDisposition 
    } = ghRes.headers as Record<string, string>

    if (contentType) res.setHeader('Content-Type', contentType)
    if (contentLength) res.setHeader('Content-Length', contentLength)
    if (contentDisposition) res.setHeader('Content-Disposition', contentDisposition)

    ghRes.data.pipe(res)
  } catch (err) {
    next(err)
  }
}
