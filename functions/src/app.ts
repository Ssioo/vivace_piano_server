import { Router } from 'express'
import user from './routes/user'
import member from './routes/member'
import places from './routes/places'

const router = Router()

router.use('/user', user)
router.use('/members', member)
router.use('/places', places)

export default router
