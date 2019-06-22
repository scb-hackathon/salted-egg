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

export interface Database {
  cart: Cart[],
  stock: Product[],
  deepLink: DeepLink[]
}

const dbDefaults: Database = {
  cart: [],
  stock: [],
  deepLink: []
}

db.defaults(dbDefaults).write()
