import {call} from 'bot/send'

const {BASE_URL} = process.env

export async function setPersistentMenu() {
  console.log('>> Setting Persistent Menu')

  await call('messenger_profile', {
    "persistent_menu": [
      {
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": [
          {
            "type": "web_url",
            "title": "Shop now",
            "url": BASE_URL + '/product_list',
            "webview_height_ratio": "compact"
          }
        ]
      }
    ]
  })

  return 'Persistent Menu OK'
}