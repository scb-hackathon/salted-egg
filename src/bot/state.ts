import {BotState, BotStateMap} from 'bot'
import {debug} from 'utils/logs'

export const botStateMap: BotStateMap = {}

export const makeSetState = (senderID: string) => (state: BotState) => {
  const prevState: BotState = botStateMap[senderID]
  const nextState: BotState = {...prevState, ...state}

  debug(`>> Bot State: ${senderID} = ${JSON.stringify(nextState)}`)

  botStateMap[senderID] = nextState
}