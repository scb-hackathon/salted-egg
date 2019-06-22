import {randomImage} from 'utils/randomImage'
import {Product} from 'utils/db'

const productNames = ['ชานมไข่มุก', 'ชานมเย็น', 'ชาไทย', 'ชาดำเย็น', 'ชานมสตรอว์เบอรรี่']

function randomizeProductName(list = productNames) {
  return list[Math.floor(Math.random() * list.length)]
}

function getRandomItem(): Product {
  const name = randomizeProductName()
  const price = Math.floor(Math.random() * 1000)

  return {name, price}
}

const Action = (type: string) => (payload: object) =>
  JSON.stringify({type, payload})

const BuyAction = Action('BUY')

function Card() {
  const item = getRandomItem()
  const payload = BuyAction(item)

  return {
    'title': `${item.name} ${item.price} บาท 🦄`,
    'image_url': randomImage(1200, 700),
    'subtitle': `ชาสกัดบริสุทธิ์จากเยอรมัน บำรุงร่างกาย`,
    'buttons': [
      {
        'type': 'postback',
        'title': 'ซื้อ',
        payload
      },
    ],
  }
}

export async function getProductsCarousel() {
  const elements = Array.from({length: 5}).map(Card)

  return {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        elements,
      },
    },
  }
}