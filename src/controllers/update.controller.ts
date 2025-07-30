import { Request, Response } from 'express';
import { fetchReleaseByTag, fetchAssetDownloadUrl } from '../services/github.service';
import axios from 'axios';

export const serveLatestYml = async (req: Request, res: Response) => {
  const tag = 'latest'
  const release = await fetchReleaseByTag(tag);
  const asset = release.assets.find((a: any) => a.name.endsWith('.yml'));
  if (!asset) return res.status(404).json({ message: 'latest.yml not found' });

  const url = asset.browser_download_url; 
  const stream = await axios.get(url, {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    responseType: 'stream', 
  });

  stream.data.pipe(res);
};

export const serveAsset = async (req: Request, res: Response) => {
  const { platform, file } = req.params;
  // asset name might include platform/version/file
  const tag = 'latest'; // or use version from file path
  const release = await fetchReleaseByTag(tag);
  const asset = release.assets.find((a: any) => a.name === file);
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  const url = asset.browser_download_url;

  const stream = await axios.get(url, {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    responseType: 'stream',
  });
  stream.data.pipe(res);
};
