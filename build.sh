#!/bin/bash
echo
echo
echo "CREATING NETWORK [kong-net]..."
docker network remove kong-net &> /dev/null
docker network create kong-net

echo
echo
echo "CREATING VOLUMES:"
docker volume remove keycloak-db-postgres-volume &> /dev/null
docker volume remove kong-db-postgres-volume &> /dev/null
docker volume remove pgadmin-volume &> /dev/null

docker volume create keycloak-db-postgres-volume
docker volume create kong-db-postgres-volume
docker volume create pgadmin-volume

echo
echo
echo "CREATING Postgres Database for Kong..."
docker run -d --name kong-db-migrations \
  --network=kong-net \
  -e "POSTGRES_DB=kong" \
  -e "POSTGRES_USER=admin" \
  -e "POSTGRES_PASSWORD=admin" \
  -e "PGDATA=/var/lib/postgresql/data/pgdata" \
  -v kong-db-postgres-volume:/var/lib/postgresql/data \
  postgres:13

sleep 15

echo
echo
echo "Running Migrations for Kong..."
docker image pull kong/kong-gateway:3.6.1.1 &> /dev/null

docker run --rm --network=kong-net \
  -e "KONG_DATABASE=postgres" \
  -e "KONG_PG_HOST=kong-db-migrations" \
  -e "KONG_PG_USER=admin" \
  -e "KONG_PG_PASSWORD=admin" \
  kong/kong-gateway:3.6.1.1 kong migrations bootstrap

docker rm -f kong-db-migrations