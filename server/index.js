require('dotenv/config');
const express = require('express');
const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();
app.use(express.json());
app.use(staticMiddleware);
app.use(sessionMiddleware);

app.get('/api/login/:userName', (req, res, next) => {
  const { userName } = req.params;
  const value = [`${userName}`];

  const findUserDB = `
  select *
  from "user"
  where "userName" = $1;`;

  db.query(findUserDB, value)
    .then(result => {
      const userObject = result && result.rows && result.rows[0];
      if (!userObject) {
        const sql2 = `
        insert into "user" ("userName")
                    values ($1)
                    returning *`;
        const value2 = [`${userName}`];
        db.query(sql2, value2).then(data => {
          req.session.userInfo = data.rows[0];
          return res.json(req.session);
        });
      } else {
        req.session.userInfo = userObject;
        return res.json(req.session);
      }
    })
    .catch(err => {
      return res.send({ message: err });
    });
});

app.get('/api/health-check', (req, res, next) => {
  db.query("select 'successfully connected' as \"message\"")
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('[http] Server listening on port', process.env.PORT);
});
