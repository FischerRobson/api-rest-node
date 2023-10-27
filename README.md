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
