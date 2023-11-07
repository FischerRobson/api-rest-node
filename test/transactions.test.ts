import { execSync } from 'node:child_process'
import { expect, test, beforeAll, afterAll, it, beforeEach } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'
import { describe } from 'node:test'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('User can create transaction', async () => {
    await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Transaction',
        amount: 10000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Transaction',
        amount: 10000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Transaction',
        amount: 10000,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Transaction',
        amount: 10000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactions = await supertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactions.body.transaction).toEqual(
      expect.objectContaining({ title: 'Transaction', amount: 10000 }),
    )
  })

  it('should be able to get summary', async () => {
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Transaction',
        amount: 10000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const createDebitTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Transaction',
        amount: 5000,
        type: 'debit',
      })

    const summaryReponse = await supertest(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryReponse.body.summary).toEqual({ amount: 5000 })
  })
})
