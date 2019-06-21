import 'dotenv/config'

import feathers from '@feathersjs/feathers'

export const app = feathers()

app.use('/hello', {
  async find() {
    return "Hello, World!"
  }
})

