#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 -v db_name="$POSTGRES_DATABASE" <<-EOSQL
    CREATE ROLE read_only;
    CREATE ROLE read_write IN ROLE read_only;
    CREATE ROLE admin IN ROLE read_write;

    CREATE USER stack_admin IN ROLE admin PASSWORD 'faux_password';
    CREATE USER stack_user IN ROLE read_write PASSWORD 'faux_password';
EOSQL

psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE $POSTGRES_DATABASE";