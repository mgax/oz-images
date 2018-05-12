import * as express from "express";
import * as child_process from "child_process";
import * as fs from "fs";

const SIZE_LIMIT = 10000;

const app: express.Application = express();

let stats = {
  'requests': 0,
  'originals': 0,
  'thumbnails': 0,
  'cache_hits': 0,
  'cache_misses': 0,
}

app.get('/stats', (req, res) => res.send(stats));

function randomNumber() {
  return Math.ceil(Math.random() * 100000000);
}

app.get('/image/:name', (req, res) => {
  let root = app.get('oz-image-path');
  let name = req.params['name'];
  let original = root + '/' + name;
  let size = req.query.size;

  stats['requests'] += 1;

  // TODO replace all fs calls with async versions
  // TODO store thumbs in a hashed folder hierarchy to accomodate a large
  // number of files

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

    stats['thumbs'] += 1;

    let thumbDir = root + '/thumbs';
    let thumb = thumbDir + '/' + size + '-' + name;

    if(fs.existsSync(thumb)) {
      stats['cache_hits'] += 1;
      res.sendFile(thumb);
      return;
    }

    stats['cache_misses'] += 1;

    if(! fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir);
    }

    let thumbTmp = thumb + '.' + randomNumber();
    let convert = child_process.spawn(
      'convert',
      [original, '-thumbnail', size, thumbTmp],
      {stdio: 'inherit'},
    );
    convert.on('close', (rv) => {
      if(rv != 0) {
        console.log('convert failed');
        res.sendStatus(500);
        return;
      }
      fs.renameSync(thumbTmp, thumb);
      res.sendFile(thumb);
    })
  }
  else {
    stats['originals'] += 1;
    res.sendFile(original);
  }
});

export default app;
