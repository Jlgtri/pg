#!/bin/bash

node_output=$(node ./scripts/get-apps.js)

for SERVICE in ${node_output[@]}; do
  if [ "$1" == "$SERVICE" ]; then
     node dist/apps/$1/main $1
     exit 0
  fi
done

echo "No service match found"
exit 1