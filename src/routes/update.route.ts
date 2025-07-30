import { Router } from 'express'
import { serveAsset, serveLatestYml } from '../controllers/update.controller'

const router = Router()

router.get('/:platform/latest.yml', serveLatestYml)
router.get('/:platform/:file', serveAsset)

export default router
