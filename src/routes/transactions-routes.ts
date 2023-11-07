import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  // global middleware, but exists only in this plugin context
  app.addHook('preHandler', async (req, res) => {
    console.log(`${req.method} ${req.url}`)
  })

  app.get('/', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const { sessionId } = req.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select('*')

    return res.send({ transactions })
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const { sessionId } = req.cookies

    const transaction = await knex('transactions')
      .select('*')
      .where('id', id)
      .andWhere('session_id', sessionId)
      .first()

    return res.send({ transaction })
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (req, res) => {
      const { sessionId } = req.cookies
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return res.send({ summary })
    },
  )

  app.post('/', async (req, res) => {
    const bodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = bodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24, // one day in ms
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return res.status(201).send()
  })
}
