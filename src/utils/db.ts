import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const DB_FILE = './db.json'

export const adapter = new FileSync(DB_FILE)

export const db = low(adapter)

export const PriceMap: {[item: string]: number} = {}
export const CurrentItemMap: {[customer: string]: string} = {}

export interface Product {
  name: string,
  price: number,
}

export type Cart = {
  buyer: string
} & Product

export interface DeepLink {
  sender: string,
  transactionId: string,
  userRef: string
}

export interface QRCode {
  sender: string
  ref: string
}

export interface Database {
  cart: Cart[],
  stock: Product[],
  deepLink: DeepLink[]
  qr: QRCode[]
}

const dbDefaults: Database = {
  cart: [],
  stock: [],
  deepLink: [],
  qr: []
}

db.defaults(dbDefaults).write()
