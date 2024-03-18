#!/bin/bash
echo "CREATING NETWORK [kong-net]:"
docker network create kong-net

echo "CREATING VOLUMES:"
docker volume create kong-db-postgres-volume
docker volume create kong-db-pgadmin-volume