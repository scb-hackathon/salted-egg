import {Request, Response} from 'express'
import {generateQRCode} from 'qr'
import {debug} from 'utils/logs'
import * as fs from 'fs'

export async function QRRoute(req: Request, res: Response) {
  const {account, number} = req.params

  const result = await generateQRCode(number)
  if (!result) {
    res.send({status: 'Cannot generate QR for this number.'})
    return
  }

  const {qrRawData, qrImage} = result
  debug(`>> QR Generated:`, qrRawData)

  const buffer = Buffer.from(qrImage, 'base64')

  res.setHeader('Content-Type', 'image/png')
  res.send(buffer)
}