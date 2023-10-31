import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { knex } from './database'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions-routes'

const app = fastify()
app.register(cookie)

app.register(transactionsRoutes, {
  prefix: '/transactions',
})

app.get('/db', async () => {
  return await knex('sqlite_schema').select('*')
})

app.listen({ port: env.PORT }).then(() => {
  console.log('Server running')
})
