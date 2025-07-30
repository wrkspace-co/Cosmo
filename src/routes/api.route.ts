import { Router } from 'express'
import { getReleases } from '../controllers/api.controller'

const router = Router()

router.get('/versions', getReleases)

export default router
