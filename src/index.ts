import express from 'express';

const app = express();
const port = 5000;

app.get('/test', (_req, res) => res.send('Hello World!'));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);
