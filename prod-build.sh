#!/bin/bash

# build api app
go get -v
CGO_ENABLED=0 go build -o dist/sparschwein

# build frontend app
cd sparschwein-client && yarn build && cd ..

# copy files to dist folder
cp .env dist/.env
cp -r sparschwein-client/build dist/frontend
