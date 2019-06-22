import {Request, Response} from 'express'
import {generateQRCode} from 'qr'
import {debug} from 'utils/logs'
import {db, QRCode} from 'utils/db'

export async function QRRoute(req: Request, res: Response) {
  const {account, number} = req.params
  const {fbid} = req.query

  const ref = Math.floor(Math.random() * 100000)
  debug(`Reference: ${ref}`)

  const result = await generateQRCode(number, String(ref))
  if (!result) {
    res.send({status: 'Cannot generate QR for this number.'})
    return
  }

  const {qrRawData, qrImage} = result
  debug(`>> QR Generated:`, qrRawData)

  const buffer = Buffer.from(qrImage, 'base64')

  // Associate this QR code with this facebook sender
  if (fbid) {
    const qrCode: QRCode = {
      sender: fbid,
      ref: String(ref)
    }

    db.get('qr').push(qrCode).write()
  }

  res.setHeader('Content-Type', 'image/png')
  res.send(buffer)
}