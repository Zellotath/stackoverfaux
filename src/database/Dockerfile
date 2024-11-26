FROM postgres:latest

# Not recommended, but for the sake of this prototype, just putting this here
ENV POSTGRES_DATABASE=stackoverfaux
ENV POSTGRES_PASSWORD=faux_password

COPY init-db.sh /docker-entrypoint-initdb.d/