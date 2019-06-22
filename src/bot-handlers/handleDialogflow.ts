import {QueryResult} from 'dialogflow'
import {BotResponse} from 'bot'
import {info} from 'utils/logs'

export function handleDialogflow(dialogflow: QueryResult | null): BotResponse | false {
  if (!dialogflow) return false

  const {fulfillmentText, parameters, intent} = dialogflow
  const {fields} = parameters
  const {displayName: intentName} = intent

  if (intentName === 'how-to-pay') {
    info('Intent = How to Pay?')

    return fulfillmentText
  }

  if (fields.ProductNames) {
    const {stringValue: productName} = fields.ProductNames

    if (Math.random() > 0.9) {
      return `${productName}หมดแล้วค่ะ ขอโทษด้วยนะคะ`
    }
  }

  if (fulfillmentText) return fulfillmentText

  return false
}