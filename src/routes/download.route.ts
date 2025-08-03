import { Router } from 'express'
import { handleDownload, handleDownloadByAssetId } from '../controllers/download.controller'

const router = Router()

router.get('/', handleDownload)
router.get('/:assetId', handleDownloadByAssetId)

export default router
