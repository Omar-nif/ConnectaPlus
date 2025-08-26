// src/services/services.routes.ts
import { Router } from 'express'
import * as Services from './services.controller'

const router = Router()

router.get('/', Services.listAll)
router.get('/categories', Services.listByCategory)
router.get('/:slug', Services.getBySlug)

export default router
