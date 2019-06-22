import {QueryResult} from '@types/dialogflow'
import {BotResponse} from 'bot/Bot'

export function handleDialogflow(dialogflow: QueryResult | null): BotResponse | false {
  if (!dialogflow) return false

  const {fulfillmentText, parameters} = dialogflow
  const {fields} = parameters

  if (fields.ProductNames) {
    const {stringValue: productName} = fields.ProductNames

    if (Math.random() > 0.9) {
      return `${productName}หมดแล้วค่ะ ขอโทษด้วยนะคะ`
    }
  }

  if (fulfillmentText) return fulfillmentText

  return false
}