import * as express from "express";

const app: express.Application = express();

function greeter(person: string) {
  return "Hello, " + person;
}

app.get('/', (req, res) => res.send(greeter('jane')));

export default app;
