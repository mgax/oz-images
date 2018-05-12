# Image scaling service
Serve original and scaled images from a static folder.

## Usage
```shell
make
docker-compose up -d
```

To mount a specific folder for the images, add the following lines to a
`docker-compose.override.yml` file:

```yaml
version: "2"

services:

  app:
    volumes:
      - path/to/images:/app/images
```

Images are served at `http://localhost:8080/image/$filename`. The endpoint
supports a `size` argument which returns scaled images, e.g.
`/image/$filename?size=100x100`.

Scaling keeps the original aspect ratio and constraining the thumbnail to fit
inside the given bounding box. This is done using Imagemagick's `convert
-thumbnail` [command](https://www.imagemagick.org/Usage/thumbnails/).


## Development
To run the test suite, simply run `make test`. It will spin up a docker
container and run the tests.

To open an interactive docker container that mounts the source code repository
in the app directory, run `make sh`. This is useful when adding npm
dependencies.

To compile the TypeScript source to JavaScript, e.g. in an interactive Docker
container, run `make ts`.
