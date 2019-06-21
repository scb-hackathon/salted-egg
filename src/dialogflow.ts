import dialogflow from 'dialogflow'
import uuid from 'uuid'

const PROJECT_ID = 'sellerbot-th1'

/**
 * Send a query to the dialogflow agent, and return the query result.
 */
export async function matchIntent(text: string) {
  // A unique identifier for the given session
  const sessionId = uuid.v4()

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient()
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
}