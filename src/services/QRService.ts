import {Request, Response} from 'express'
import {generateQRCode} from 'qr'

export async function QRRoute(req: Request, res: Response) {
  const {account, number} = req.params

  const result = await generateQRCode(number)

  res.send({account, number, result})
}