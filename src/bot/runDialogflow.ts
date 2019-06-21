import uuid from 'uuid'
import {wtf} from 'bot/handleMessage'
import {QueryResult, SessionsClient} from 'dialogflow'

const PROJECT_ID = 'sellerbot-th1-ucuhdp'

/**
 * Send a query to the dialogflow agent, and return the query result.
 */
export async function runDialogflow(text: string): Promise<QueryResult | null> {
  try {
    // A unique identifier for the given session
    const sessionId = uuid.v4()

    // Create a new session
    const sessionClient = new SessionsClient()

    const sessionPath = sessionClient.sessionPath(PROJECT_ID, sessionId)

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text,

          // The language used by the client (en-US)
          languageCode: 'th-TH',
        },
      },
    }

    // Send request and log result
    const responses = await sessionClient.detectIntent(request)
    const results = responses.filter(x => x).filter(x => x.queryResult).map(x => x.queryResult)

    if (results.length > 1) {
      console.log('[??] Dialogflow Intents:', results.length)
    }

    const [result] = results

    if (result) {
      const {fulfillmentText, intent} = result
      const {name, displayName} = intent

      console.log('[💬] Fulfillment Response:', fulfillmentText)
      console.log(`[💬] Intent: ${displayName} (${name})`)
    }

    return result
  } catch (error) {
    wtf('Error happened on Dialogflow:', error.message)

    return null
  }
}