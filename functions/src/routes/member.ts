import { Router } from 'express'
import { sendErr } from '../utils/sender'
import { getDataArrFrom, getDatumFrom } from '../utils/list-maker'
import { GroupType, User } from '../models/types'
import * as admin from 'firebase-admin'
import { decodeJwt } from '../utils/auth'

const router = Router()


/*
* 전체 유저 리스트 조회 API
* */
router.get('/', async (req, res) => {
  try {
    const user = await decodeJwt(req)
    if (!user) throw new Error('Token Not Valid')
    const users = await getDataArrFrom<User>('/user')
    users.forEach((u) => {
      delete u.pwd
    })
    res.send({
      status: 200,
      data: users,
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

/*
* 어드민에서 회원등록하는 API
* */
router.post('/', async (req, res) => {
  try {
    const { name, phone, generations, roles, group, birth, univ, grade, hakbun, department, memo } = req.body
    if (!name || !phone || !generations || !roles || !group || !birth || !univ || !grade || !hakbun || !department || !memo) {
      throw new Error('Invalid Parameters')
    }
    const users = await getDataArrFrom<User>('/user')
    if (users.find((u) => u.name === name && u.phone === phone)) {
      res.send({
        status: 401,
        msg: 'Already User Exists',
      })
      return
    }
    const userDB = admin.database().ref('/user')
    await userDB.push(<Partial<User>>{
      name,
      phone,
      pwd: birth.substring(birth.length - 4),
      createdAt: new Date().toJSON(),
      roles,
      birth,
      univ,
      grade,
      hakbun,
      department,
      group,
      generations,
      memo,
      expiredAt: group === GroupType.VIVACE ? null : new Date().toJSON(),
    })
    res.send({
      status: 200,
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

/*
* 어드민에서 특정 유저 정보 업데이트할 수 있는 API (pwd만 빼고)
* */
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, generations, group, roles, univ, department, grade, hakbun, memo } = req.body
    const id = req.path
    const userDBRef = admin.database().ref('/user').child(id)
    await userDBRef.update(<Partial<User>>{
      name,
      phone,
      univ,
      grade,
      hakbun,
      department,
      roles,
      generations,
      group,
      memo,
    })
    if (group !== GroupType.NONE) {
      await userDBRef.update(<Partial<User>>{ expiredAt: null })
    }
    res.send({
      status: 200,
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

/*
* 어드민에서 특정 유저 pwd 초기화하는 API
* */
router.post('/newPassword/:id', async (req, res) => {
  try {
    const id = req.path
    const prevData = await getDatumFrom<User>('/user', id)
    const userDBRef = admin.database().ref('/user').child(id)
    await userDBRef.update(<Partial<User>>{
      pwd: prevData?.birth ? prevData.birth.substring(prevData.birth.length - 4) : '0000',
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

/*
* 어드민에서 특정 유저 완전히 삭제하는 API (실수 대비)
* */
router.delete('/:id', async (req, res) => {
  try {
    const id = req.path
    const userDBRef = admin.database().ref('/user').child(id)
    await userDBRef.remove()
    res.send({
      status: 200,
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

/*
* 어드민에서 특정 유저 만료 처리
* */
router.post('/expire/:id', async (req, res) => {
  try {
    const id = req.path
    const userDBRef = admin.database().ref('/user').child(id)
    await userDBRef.update(<Partial<User>>{ expiredAt: new Date().toJSON(), group: GroupType.NONE })
    res.send({
      status: 200,
    })
  } catch (e) {
    sendErr(req, res, e)
  }
})

export default router
