import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { knex } from './database'
import { transactionsRoutes } from './routes/transactions-routes'

export const app = fastify()
app.register(cookie)

app.register(transactionsRoutes, {
  prefix: '/transactions',
})

app.get('/db', async () => {
  return await knex('sqlite_schema').select('*')
})
