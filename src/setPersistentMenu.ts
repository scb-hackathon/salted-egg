import {call} from 'bot/send'

export async function setPersistentMenu() {
  const baseURL = 'https://1d747d7e.ngrok.io'

  await call('messenger_profile', {
    "persistent_menu": [
      {
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": [
          {
            "type": "web_url",
            "title": "Shop now",
            "url": baseURL + '/product_list',
            "webview_height_ratio": "compact"
          }
        ]
      }
    ]
  })

  return 'Persistent Menu OK'
}