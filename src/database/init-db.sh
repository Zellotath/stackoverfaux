#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 -v db_name="$POSTGRES_DATABASE" <<-EOSQL
    CREATE ROLE read_only;
    CREATE ROLE read_write IN ROLE read_only;
    CREATE ROLE admin IN ROLE read_write;

    CREATE USER stack_admin IN ROLE admin PASSWORD 'faux_password';
    CREATE USER stack_user IN ROLE read_write PASSWORD 'faux_password';

    ALTER USER stack_admin WITH SUPERUSER;
EOSQL

psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE $POSTGRES_DATABASE";

psql -v ON_ERROR_STOP=1 -v db_name="$POSTGRES_DATABASE" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE :db_name TO stack_admin;

    GRANT ALL PRIVILEGES ON SCHEMA public TO stack_admin;
EOSQL
