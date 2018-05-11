# Image scaling service
Serve original and scaled images from a static folder.

## Usage
```shell
docker build . --tag oz-images
docker-compose up -d
```

Run the test suite:
```shell
docker run --rm -i -t oz-images npm test
```
