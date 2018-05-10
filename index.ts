import * as express from "express";

const app = express();

function greeter(person: string) {
  return "Hello, " + person;
}

app.get('/', (req, res) => res.send(greeter('jane')));

app.listen(80, () => console.log('App running on port 80'));
