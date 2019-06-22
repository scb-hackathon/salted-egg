import {send} from 'messenger/send'

export function createReply(sid: string) {
  return function reply(response: string | object) {
    if (typeof response === 'string') {
      return send(sid, {text: response})
    }

    return send(sid, response)
  }
}