import { Router } from 'express'
import * as admin from 'firebase-admin'
import { decodeJwt, encodeJwt } from '../utils/auth'
import { Chulcheck, User } from '../models/types'
import { sendErr } from '../utils/sender'
import { getDataArrFrom, getUniqueDatumFrom } from '../utils/list-maker'

const router = Router()

/*
* 클라이언트에서 Profile 조회하는 API
* */
router.get('/me', async (req, res) => {
  try {
    const user = await decodeJwt(req)
    if (!user) throw new Error('No User Matched')
    const found = await getUniqueDatumFrom<User>('/user', user.key)
    if (!found) throw new Error('No User Matched')
    res.send({
      status: 200,
      data: found,
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

/*
* 클라이언트에서 phone과 pwd로 로그인하는 API
* */
router.post('/signIn', async (req, res) => {
  try {
    const { phone, pwd } = req.body
    const users = await getDataArrFrom<User>('/user')
    const found = users.find((u) => u.phone.split('-').join('') === phone && u.pwd === pwd)
    if (!found) throw new Error('No Such User')
    const token = await encodeJwt(found.key)
    res.send({
      status: 200,
      data: { token },
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

/*
* 클라이언트에서 자기 비밀번호 변경할 수 있는 API
* */
router.patch('/newPassword', async (req, res) => {
  try {
    const user = await decodeJwt(req)
    if (!user) throw new Error('User Not Exist')
    const { newPwd } = req.body
    const userDBRef = admin.database().ref('/user').child(user.key)
    await userDBRef.child(user.pwd).set(newPwd)
    res.send({
      status: 200,
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

/*
* 클라이언트에서 출석체크하는 API
* */
router.post('/chulcheck', async (req, res) => {
  try {
    const user = await decodeJwt(req)
    if (!user) throw new Error('User Not Exist')
    const today = new Date()
    const todayChulchecks = await getDataArrFrom<Chulcheck>('/chulcheck', today.toDateString())
    if (todayChulchecks.find((c) => c.userKey === user.key)) {
      res.send({
        status: 401,
        msg: 'Already ChulChecked',
      })
      return
    }
    const { latLng, time } = req.body
    if (!latLng || !time) throw new Error('Invalid Parameters')
    // TODO: latLng 검사.
    const chulCheckDBRef = admin.database().ref('/chulkcheck').child(today.toDateString())
    await chulCheckDBRef.push(<Chulcheck>{
      userKey: user.key,
      createdAt: today.toJSON(),
      latLng,
      time,
    })
    res.send({
      status: 200,
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

/*
* 클라이언트에서 출석체크한 내역 조회 API
* */
router.get('/history', async (req, res) => {
  try {
    const user = await decodeJwt(req)
    if (!user) throw new Error('User Not Exist')
    res.send({
      status: 200,
      data: [],
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

export default router
