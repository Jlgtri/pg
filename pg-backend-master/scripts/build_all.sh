# /bin/bash

build() {
    SERVICE=$1
    yarn build "$SERVICE:"
}

node_output=$(node ./scripts/get-apps.js)

for SERVICE in ${node_output[@]}; do
 build $SERVICE &
done
wait
