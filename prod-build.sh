#!/bin/bash

# delete old build
rm -rf dist
echo "Deleted old build"

# build api app
go get -v
echo "Downloaded backend dependencies"
# in case of linux
#CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o dist/sparschwein
# in case of freebsd
CGO_ENABLED=0 GOOS=freebsd GOARCH=amd64 go build -o dist/sparschwein
echo "Built backend app"
echo "- don't foget to set .env location via SPARSCHWEINENVPATH on your server when executing it -"

# build frontend app
cd sparschwein-client && yarn build && cd ..
echo "Built frontend app"
echo "- don't forget to set your webserver config up to work with react-router -"

# copy files to dist folder
cp .env dist/.env
cp -fr sparschwein-client/build/ dist/frontend/
echo "Copied files to dist folder"
# remind user of basic auth htpasswd file
echo "Don't forget to create or update your htpasswd file if necessary"
echo "---  SUCCESS ---"
