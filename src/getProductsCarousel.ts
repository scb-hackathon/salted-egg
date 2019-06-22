const {BASE_URL} = process.env

function Card(_: any, index: number) {
  const url = `${BASE_URL}/product_list`

  return {
    'title': "Lung Too's Store",
    'image_url': `https://picsum.photos/1200/700?cb=${index}`,
    'subtitle': 'We have the right tank for everyone.',
    'default_action': {
      'type': 'web_url',
      url,
      'webview_height_ratio': 'compact',
    },
    'buttons': [
      {
        'type': 'web_url',
        url,
        'title': 'View Website',
      },
    ],
  }
}

export async function getProductsCarousel() {
  return {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'generic',
        'elements': [...Array(5)].map(Card),
      },
    },
  }
}