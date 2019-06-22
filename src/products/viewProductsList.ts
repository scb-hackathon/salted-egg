import {randomImage} from 'utils/randomImage'

const {BASE_URL} = process.env

export function viewProductsList() {
  const imageURL = randomImage(1200, 700)
  const url = `${BASE_URL}/pay/0812390813/900`

  return {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': `ดูรายชื่อสินค้า`,
            'image_url': imageURL,
            'subtitle': `ดูรายชื่อสินค้า`,
            'default_action': {
              'type': 'web_url',
              url,
              'webview_height_ratio': 'tall',
            },
            'buttons': [
              {
                'type': 'web_url',
                'title': 'จ่ายเงิน',
                url,
                'webview_height_ratio': 'tall',
              },
            ],
          },
        ],
      },
    },
  }
}