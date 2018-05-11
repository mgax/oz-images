import * as express from "express";
import * as child_process from "child_process";

const app: express.Application = express();

function greeter(person: string) {
  return "Hello, " + person;
}

app.get('/', (req, res) => res.send(greeter('jane')));

app.get('/image/:name', (req, res) => {
  let root = app.get('oz-image-path');
  let name = req.params['name'];
  let original = root + '/' + name;
  let size = req.query.size;

  if(size) {
    if(! size.match(/^(\d+)x(\d+)$/)) {
      res.sendStatus(404);
      return;
    }

    // TODO limit thumbnail size
    // TODO reuse thumbnails

    let thumb = root + '/' + size + '-' + name;
    let convert = child_process.spawn(
      'convert',
      [original, '-thumbnail', size, thumb],
    );
    // TODO error handling on spawn and close
    convert.on('close', () => {
      res.sendFile(thumb);
    })
  }
  else {
    res.sendFile(original);
  }
});

export default app;
