import {BotContext} from '.'

import {botStateMap, makeSetState} from 'bot/state'
import {createReply} from 'bot/create-reply'

export function buildContext(sender: string): BotContext {
  const reply = createReply(sender)
  const state = botStateMap[sender]
  const setState = makeSetState(sender)

  const context: BotContext = {
    sender,
    reply,
    state,
    setState
  }

  // Initialize State
  if (!state) setState({asking: false})

  return context
}