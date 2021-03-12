import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export const getDataArrFrom = async <T extends { key: string }>(ref: string, child?: string): Promise<T[]> => {
  const data = child ?
    await admin.database().ref(ref).child(child).once('value') :
    await admin.database().ref(ref).once('value')
  const rows = data.val()
  functions.logger.debug(rows)
  const result: T[] = []
  for (const i in rows) {
    if (rows[i]) result.push({ ...rows[i], key: i })
  }
  return result
}

export const getDatumFrom = async <T extends { key: string }>(ref: string, child: string): Promise<T | undefined> => {
  const data = await admin.database().ref(ref).child(child).once('value')
  const rows = data.val()
  functions.logger.debug(rows)
  const result: T[] = []
  for (const i in rows) {
    if (rows[i]) result.push({ ...rows[i], key: i })
  }
  return result.length > 0 ? result[0] : undefined
}

export const getUniqueDatumFrom = async <T extends { key: string }>(ref: string, child: string): Promise<T | undefined> => {
  const data = await admin.database().ref(ref).child(child).once('value')
  return data.val()
}
