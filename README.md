# stackoverfaux

A simple Stack Overflow-like site backend.

# Getting started

1. Install [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
2. Install the correct node version (found in .nvmrc) with `nvm install`
3. Install the project dependencies with `npm install`
4. Configure environment variables

   ```
   cp .env.example .env
   ```

   Update any environment variables that need to be changed for the local environment and ensure that all variables are defined.

5. Run the database image with `npm run start-db`
6. Run the development server with `npm run local`

# Data Model

The Stack Overfaux data model is modeled with [Prisma](https://www.prisma.io/). The client (containing the types of the model objects) is automatically generated when `@prisma/client` is installed. If changes are made to the [schema](/src/database/schema.prisma), the client will need to be regenerated using the `npm run regenerate-models` command.

Additionally, changes to the Prisma schema will need to be applied to any existing databases. This is done with migration scripts, which are created and applied with `npm run local-migrate`. On production, these would be applied by CI/CD running a command invoking `prisma migrate deploy` (see [here](https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate) for more information).

## Changing the Data Model

To make changes to the data model, update the Prisma [schema](/src/database/schema.prisma) and run the `npm run local-migrate -- --name <name of migration>` command. This will update the client from `@prisma/client` and generate a migration file that can be applied to other environments.

## Seeding Data

Data is seeded when `npm run start-db` or `npm run reset-db` is executed. Seed data can be found in the [/src/database/seed](/src/database/seed) directory. In it, there's a `seed.ts` script that executes commands against the database to populate it with seed data. The data comes from the [stackoverfaux.json](/src/database/seed/stackoverfaux.json) file in that directory.

# Testing

Currently there are no automated tests. Would like to add unit tests (using Jest, for example) and e2e tests once there's a UI (using Cypress). For now it's a TODO.

## Postman Collection

There's a [Postman collection](/stackoverfaux-postman.json) for exercising the various implemented endpoints.

# Next Steps

- Tests and comments
- Implement an `authenticate` middleware to check a token in the request header and add the user to the request object
- Implement `authorizeFor` to actually check permissions
  - Checks against the user associated with the request
  - Can only delete/edit the things that you're the user who created it
- Create a `changelog` schema with copies of the tables
  - Whenever a change is made to any of the records, record the change in the changelog table
  - This can be done with client extensions on the Prisma client configuration
  - Make it a generic function so we don't have to rewrite the same "update changelog" methods for everything
- Update the application logger to also log the request ID, which would be set by a middleware that generates a unique ID for each request
- Use DataDog & Sentry or the like (add Winston transports, etc)
