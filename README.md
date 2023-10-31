# API REST NODE

### Stack

- Node.JS
- Typescript
- TSX
- Knex
- SQLite
- Dotenv
- Zod

### DB

Create a migration:

`npm run knex -- migrate:make [migration_name]`

Rollback last migration:

`npm run knex -- migrate:rollback`

Run migrations:

`npm run knex -- migrate:latest`

### FR

- User must can create new transaction;
- User must can get account resume;
- User must can get all trasactions history;
- User must can view one trasaction;

### BR

- Transaction can be debit (subtract from amount), credit (sum to amount);
- Must identify user betweem requests;
- User can only view your transactions;

### NFR