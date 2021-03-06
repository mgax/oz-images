all: build

build:
	docker build . --tag oz-images

sh: build
	docker run --rm -i -t --volume=`pwd`:/app oz-images bash

test: build
	docker run --rm -i -t oz-images npm test

ts:
	node_modules/.bin/tsc
