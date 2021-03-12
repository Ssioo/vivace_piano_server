import { Router } from 'express'
import { sendErr } from '../utils/sender'
import { decodeJwt } from '../utils/auth'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const user = await decodeJwt(req)
    if (!user) throw new Error('Token Expired')
  } catch (e) {
    sendErr(req, res, e)
  }
})

router.post('/', async (req, res) => {
  try {
    const user = await decodeJwt(req)
    if (!user) throw new Error('UnAuthorized User')
  } catch (e) {
    sendErr(req, res, e)
  }
})

export default router
