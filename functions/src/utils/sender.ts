import * as functions from 'firebase-functions'
import express from 'express'

export const sendErr = (req: express.Request, res: express.Response, e: Error) => {
  functions.logger.log(e)
  res.send({
    status: 400,
    msg: e.message,
  })
}
