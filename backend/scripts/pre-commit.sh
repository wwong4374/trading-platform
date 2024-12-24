#!/bin/bash

cd "$(git rev-parse --show-toplevel)/backend"
yarn prettier --write "src/**/*.ts" --config .prettierrc.json
yarn eslint . --ext .ts --fix
git add .