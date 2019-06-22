import {BotState} from 'bot'
import {debug} from 'utils/logs'

export const BotStateMap: BotState = {
  asking: false
}

export const makeSetState = (senderID: string) => (state: BotState) => {
  const prevState = BotStateMap[senderID]
  const nextState = {...prevState, ...state}

  debug(`>> Bot State: ${senderID} = ${JSON.stringify(nextState)}`)

  BotStateMap[senderID] = nextState
}