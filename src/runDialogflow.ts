import uuid from 'uuid'
import {wtf} from 'bot/handleMessage'
import {SessionsClient} from 'dialogflow'

const PROJECT_ID = 'sellerbot-th1-ucuhdp'

/**
 * Send a query to the dialogflow agent, and return the query result.
 */
export async function runDialogflow(text: string) {
  console.debug('>> Matching Intent:', text)

  try {
    // A unique identifier for the given session
    const sessionId = uuid.v4()

    // Create a new session
    const sessionClient = new SessionsClient()
    console.log('>> SessClient =', sessionClient)

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

    console.log('>> Intent Responses =', responses.length)

    const result = responses[0].queryResult

    return result
  } catch (error) {
    wtf('Error happened on Dialogflow:', error.message)
  }
}