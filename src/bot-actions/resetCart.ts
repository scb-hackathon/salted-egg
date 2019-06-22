import {Cart, db} from 'utils/db'

export function resetCart(sender: string) {
  const list: Cart[] = db.get('cart').value()
  const newList = list.filter(x => x.buyer !== sender)

  console.log('>> Resetting Cart for User =', sender)

  db.set('cart', newList).write()
}