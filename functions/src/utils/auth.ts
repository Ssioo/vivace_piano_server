import * as functions from 'firebase-functions'
import { Jwt, User } from '../models/types'
import * as jwt from 'jsonwebtoken'
import * as admin from 'firebase-admin'
import express from 'express'

export const SECRET = 'VIVACE10TH_ANNIVERSARY'

export const decodeJwt = async (req: express.Request): Promise<User | undefined> => {
  const token = req.header('x-access-token')
  if (!token) throw new Error('JWT Not Exist')
  try {
    const decoded = jwt.verify(token, SECRET) as Jwt
    const userDB = await admin.database().ref('/user').once('value')
    const users = userDB.val()
    const user = users[decoded.userId]
    return user ? { ...user, key: decoded.userId } : undefined
  } catch (e) {
    functions.logger.log(e)
    return undefined
  }
}

export const encodeJwt = async (userId: string) => {
  return jwt.sign({ userId }, SECRET)
}
