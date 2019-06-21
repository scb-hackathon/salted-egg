import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const DB_FILE = './db.json'

export const adapter = new FileSync(DB_FILE)

export const db = low(adapter)

export interface Item {
  name: string,
  price: number,
}

export interface Database {
  cart: {[customer: string]: Item[]},
  stock: {[name: string]: Item}
}

const dbDefaults: Database = {
  cart: {},
  stock: {}
}

db.defaults(dbDefaults).write()
