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

// USER CAN SEARCH POSTS BY LOCATION
app.get('/api/post/:location', (req, res, next) => {
  const { location } = req.params;
  const sql = `
    SELECT *
      FROM "post"
     WHERE "sellerId" IN
      (SELECT "userId"
         FROM "user"
        WHERE "location" = $1)
  `;
  const params = [location];
  db.query(sql, params)
    .then(result => {
      const posts = result.rows;
      if (!posts.length) {
        res.status(404).json({
          error: `Cannot find posts in area ${location}`
        });
      } else {
        res.json(posts);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

// USER CAN EDIT PROFILE
app.put('/api/user/:userId', (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const { email } = req.body;
  const { profileImg } = req.body;
  const { coverImg } = req.body;
  const { description } = req.body;
  const { location } = req.body;
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      error: 'UserId must be a positive integer'
    });
  }
  if (!email) {
    return res.status(400).json({
      error: 'Email is a required field'
    });
  }
  if (!location) {
    return res.status(400).json({
      error: 'Location is a required field'
    });
  }
  const sql = `
  UPDATE     "user"
  SET        "email" = $1,
             "profileImg" = $2,
             "coverImg" = $3,
             "description" = $4,
             "location" = $5
  WHERE      "userId" = $6
  RETURNING  *
  `;
  const params = [email, profileImg, coverImg, description, location, userId];

  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
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
