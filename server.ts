import * as express from "express";
import * as child_process from "child_process";
import * as fs from "fs";

const SIZE_LIMIT = 10000;

const app: express.Application = express();

function greeter(person: string) {
  return "Hello, " + person;
}

app.get('/', (req, res) => res.send(greeter('jane')));

function randomNumber() {
  return Math.ceil(Math.random() * 100000000);
}

app.get('/image/:name', (req, res) => {
  let root = app.get('oz-image-path');
  let name = req.params['name'];
  let original = root + '/' + name;
  let size = req.query.size;

  // TODO replace all fs calls with async versions

  if(size) {
    let sizeMatch = size.match(/^(\d+)x(\d+)$/)
    if(! sizeMatch) {
      res.sendStatus(404);
      return;
    }
    if(+sizeMatch[1] > SIZE_LIMIT || +sizeMatch[2] > SIZE_LIMIT) {
      res.sendStatus(404);
      return;
    }

    let thumbDir = root + '/thumbs';
    let thumb = thumbDir + '/' + size + '-' + name;

    if(fs.existsSync(thumb)) {
      res.sendFile(thumb);
      return;
    }

    if(! fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir);
    }

    let thumbTmp = thumb + '.' + randomNumber();
    let convert = child_process.spawn(
      'convert',
      [original, '-thumbnail', size, thumbTmp],
    );
    // TODO error handling on spawn and close
    convert.on('close', () => {
      fs.renameSync(thumbTmp, thumb);
      res.sendFile(thumb);
    })
  }
  else {
    res.sendFile(original);
  }
});

export default app;
