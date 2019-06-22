import {call} from 'messenger/send'

export async function setPersistentMenu() {
  console.log('>> Setting Persistent Menu')

  const catalogueButton = {
    'type': 'postback',
    'title': 'ดูสินค้า 🦄',
    payload: 'DISPLAY_CATALOGUE_CAROUSEL'
  }

  await call('messenger_profile', {
    "persistent_menu": [
      {
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": [catalogueButton]
      }
    ]
  })

  return 'Persistent Menu OK'
}