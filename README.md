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
