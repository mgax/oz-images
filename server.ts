import * as express from "express";

const app: express.Application = express();

function greeter(person: string) {
  return "Hello, " + person;
}

app.get('/', (req, res) => res.send(greeter('jane')));

app.get('/image/:name', (req, res) => {
  let name = req.params['name'];
  res.sendFile(name, {root: app.get('oz-image-path')});
});

export default app;
