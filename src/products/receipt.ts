import {Cart} from 'utils/db'

export function buildReceipt(items: Cart[]) {
  // let image = 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2F7821b17e-28f5-11e4-8b81-00144feabdc0?fit=scale-down&source=next&width=700'

  const totalPrice = items.map(x => x.price).reduce((x, y) => x + y, 0)

  const carts = items.map((x, i) => ({
    title: x.name,
    subtitle: x.name,
    quantity: 1,
    price: x.price,
    currency: 'THB',
    image_url: `https://picsum.photos/200?prayuth=${i}`
  }))

  return {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'receipt',
        'recipient_name': 'Stephane Crozatier',
        'order_number': '12345678902',
        'currency': 'THB',
        'payment_method': 'Visa 2345',
        'order_url': 'http://petersapparel.parseapp.com/order?order_id=123456',
        'timestamp': '1428444852',
        'address': {
          'street_1': '1 Hacker Way',
          'street_2': '',
          'city': 'Menlo Park',
          'postal_code': '94025',
          'state': 'CA',
          'country': 'US',
        },
        'summary': {
          'subtotal': totalPrice,
          'total_cost': totalPrice,
        },
        'elements': carts,
      },
    },
  }
}