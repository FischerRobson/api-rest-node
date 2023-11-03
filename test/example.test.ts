import { expect, test, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('User can create transaction', async () => {
  const response = await supertest(app.server).post('/transactions').send({
    title: 'Transaction',
    amount: 10000,
    type: 'credit',
  })

  expect(response.status).toBe(201)
})
