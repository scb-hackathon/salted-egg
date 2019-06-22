import {randomImage} from 'utils/randomImage'

export async function viewProductsList() {
  return {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [
          {
            'title': `ดูรายชื่อสินค้า`,
            'image_url': randomImage(1200, 700),
            'subtitle': `ดูรายชื่อสินค้า`,
            'default_action': {
              'type': 'web_url',
              'webview_height_ratio': 'tall',
            },
            'buttons': [
              {
                'type': 'web_url',
                'title': 'จ่ายเงิน',
                'webview_height_ratio': 'tall',
              },
            ],
          },
        ],
      },
    },
  }
}