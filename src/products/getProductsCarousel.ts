import {randomImage} from 'utils/randomImage'

const {BASE_URL} = process.env

function Card() {
  const item = "ชานมไข่มุก"
  const url = `${BASE_URL}/product_list`
  const price = Math.floor(Math.random() * 1000)

  const payload = JSON.stringify({
    type: 'BUY',
    payload: {
      item,
      price,
    }
  })

  return {
    'title': item,
    'image_url': randomImage(1200, 700),
    'subtitle': `ราคา ${price} บาท`,
    'default_action': {
      'type': 'web_url',
      url,
      'webview_height_ratio': 'compact',
    },
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