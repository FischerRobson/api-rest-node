import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async (req, res) => {
    const transactions = await knex('transactions').select('*')

    return res.send({ transactions })
  })

  app.get('/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const transaction = await knex('transactions')
      .select('*')
      .where('id', id)
      .first()

    return res.send(transaction)
  })

  app.get('/summary', async (req, res) => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return res.send(summary)
  })

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
