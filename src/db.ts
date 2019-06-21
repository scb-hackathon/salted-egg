import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const DB_FILE = './db.json'

export const adapter = new FileSync(DB_FILE)

export const db = low(adapter)

export interface Product {
  name: string,
  price: number,
}

export type Cart = {
  buyer: string
} & Product

export interface Database {
  cart: Cart[],
  stock: Product[]
}

const dbDefaults: Database = {
  cart: [],
  stock: []
}

db.defaults(dbDefaults).write()
