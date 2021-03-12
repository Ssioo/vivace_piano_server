import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import express from 'express'
import apps from './app'

const cors = require('cors')
const app = express()

admin.initializeApp()

app.use(cors())
app.use('/', apps)

app.use((req, res, next) => {
  const err: any = new Error('Not Found')
  err.status = 404
  next(err)
})

export const v1 = functions.https.onRequest(app)
