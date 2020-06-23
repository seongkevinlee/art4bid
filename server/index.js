require('dotenv/config');
const express = require('express');
const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');
const multer = require('multer');
const app = express();
app.use(express.json());
app.use(staticMiddleware);
app.use(sessionMiddleware);

// Users can search posts by location(zipcode)
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

// To upload an image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './server/public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// To upload an image
app.post('/api/post/image', (req, res) => {
  const upload = multer({
    limits: {
      fileSize: 1000000
    },
    storage: storage,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Please upload a jpg., .jpeg, or .png file'));
      }
      cb(undefined, true);
    }
  }).single('image');
  upload(req, res, function (err) {
    console.error(err);
    res.end('File is successfully uploaded');
  });
});

// Users can create a post
app.post('/api/post/', (req, res, next) => {
  const { sellerId, description, imageUrl, title, startingBid, biddingEnabled, isDeleted, expiredAt } = req.body;
  const sql = `
    INSERT INTO "post" ("sellerId", "description", "imageUrl", "title", "startingBid", "biddingEnabled", "isDeleted", "expiredAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING "postId"
  `;
  const params = [sellerId, description, imageUrl, title, startingBid, biddingEnabled, isDeleted, expiredAt];
  db.query(sql, params)
    .then(result => {
      const post = result.rows[0];
      if (!post) {
        res.status(404).json({
          error: 'Failed to create post'
        });
      } else {
        res.json(post);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
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
