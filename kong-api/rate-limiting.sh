#!/bin/bash

for ((i=1; i<=20; i++))
do
    echo "Request $i:"
    curl -X GET http://localhost:8000/backend/ai
    echo "-------------------------------------------------"
done
