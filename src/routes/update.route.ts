import { Router } from 'express'
import { serveAsset, serveChannel } from '../controllers/update.controller'

const router = Router()

router.get('/:platform/:version/', serveChannel)
router.get('/:platform/:version/:file', serveAsset)

export default router
