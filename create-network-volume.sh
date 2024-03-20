#!/bin/bash
echo "CREATING NETWORK [kong-net]:"
docker network remove kong-net &> /dev/null
docker network create kong-net

echo "CREATING VOLUMES:"
docker volume remove keycloak-db-postgres-volume &> /dev/null
docker volume remove kong-db-postgres-volume &> /dev/null
docker volume remove pgadmin-volume &> /dev/null

docker volume create keycloak-db-postgres-volume
docker volume create kong-db-postgres-volume
docker volume create pgadmin-volume