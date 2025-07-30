import { Request, Response } from 'express'
import axios from 'axios'
import { findNextRelease, tokenHeader } from '../services/github.service'
import { UAParser } from 'ua-parser-js'

export async function serveChannel(req: Request, res: Response) {
  const { platform, version: clientVersion } = req.params
  const includePre = req.query.preRelease === 'true' || req.query.preRelease === '1'
  const release = await findNextRelease(clientVersion, includePre)

  if (!release) return res.status(204).end()

  const pfMap: Record<string, string> = {
    darwin: 'mac',
    win32: 'windows',
    linux: 'linux',
  }
  const pfKey = pfMap[platform]
  const yamlAsset = release.assets.find((a) => a.name.endsWith('.yml') && a.name.includes(pfKey))

  if (!pfKey) return res.status(400).json({ message: `Unsupported platform: ${platform}` })
  if (!yamlAsset) return res.status(404).json({ message: 'Channel YAML not found' })

  const apiAssetUrl = yamlAsset.url
  const response = await axios.get(apiAssetUrl, {
    headers: {
      ...tokenHeader,
      Accept: 'application/octet-stream',
    },
    responseType: 'stream',
  })

  response.data.pipe(res)
}

/**
 * Serves binary or blockmap assets referenced in the YAML.
 */
export async function serveAsset(req: Request, res: Response) {
  const { file, version: clientVersion } = req.params
  const includePre = req.query.preRelease === 'true' || req.query.preRelease === '1'
  const release = await findNextRelease(clientVersion, includePre)

  if (!release) {
    return res.status(404).json({ message: `No update metadata for version ${clientVersion}` })
  }

  const parser = new UAParser(req.get('User-Agent') || '')
  const osName = parser.getOS().name?.toLowerCase() || ''
  const os = osName === 'darwin' ? 'mac' : osName

  const fileName = file === 'latest.yml' ? `latest-${os}.yml` : file
  const asset = release.assets.find((a) => a.name === fileName)

  if (!asset) {
    return res.status(404).json({ message: `Asset ${file} not found in release` })
  }

  const response = await axios.get(asset.url, {
    headers: {
      ...tokenHeader,
      Accept: 'application/octet-stream',
    },
    responseType: 'stream',
  })

  response.data.pipe(res)
}
