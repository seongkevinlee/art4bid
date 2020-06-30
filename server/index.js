require('dotenv/config');
const express = require('express');
const db = require('./database');
const fs = require('fs');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');
const multer = require('multer');
// const { Server } = require('http');
const app = express();

app.use(express.json());
app.use(staticMiddleware);
app.use(sessionMiddleware);
// USER CAN LOGIN
app.post('/api/login/', (req, res, next) => {
  const { userName } = req.body;
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

// USER CAN SIGN UP
app.post('/api/signup/', (req, res, next) => {
  const { userName, email, password } = req.body;
  const params = [userName, email, password];
  const findUserDB = `
    INSERT INTO "user" ("userName", "email", "password")
         VALUES ($1, $2, $3)
         RETURNING *;
  `;
  db.query(findUserDB, params)
    .then(result => {
      const newUser = result.rows[0];
      if (!newUser) {
        return res.status(400).json({
          error: `Failed to create user ${userName}`
        });
      } else {
        req.session.userId = newUser.userId;
        return res.json(newUser);
      }
    })
    .catch(err => {
      return res.send({ message: err.message });
    });
});

// USER CAN SEARCH POST BY LOCATION (ZIPCODE)
app.get('/api/post/:location', (req, res, next) => {
  const { location } = req.params;
  const sql = `
    SELECT *
      FROM "post"
     WHERE "sellerId" IN
      (SELECT "userId"
         FROM "user"
        WHERE "location" = ANY($1))
  `;
  const params = [location.split(',')];
  db.query(sql, params)
    .then(result => {
      const posts = result.rows;
      if (!posts.length) {
        return res.status(400).json({
          error: `Cannot find posts in area ${location}`
        });
      } else {
        return res.json(posts);
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: `An unexpected error occurred. ${err.message}`
      });
    });
});

// USER CAN VIEW PROFILE
app.get('/api/user/:userId', (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const sql = `
    SELECT     *
    FROM       "user"
    WHERE      "userId" = $1
    `;
  const params = [userId];
  db.query(sql, params)
    .then(result => { res.json(result.rows[0]); })
    .catch(err => next(err));
});

// USER CAN EDIT PROFILE
app.post('/api/user/:userId', (req, res, next) => {
  const folder = './server/public/images/user-profiles';
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({
    limits: {
      fileSize: 10000000
    },
    storage: storage,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        return cb(new Error('Please upload a jpg., .jpeg, or .png file'));
      }
      cb(undefined, true);
    }
  }).array('image');
  upload(req, res, function (err) {
    const userId = parseInt(req.params.userId);
    const { email, profileImg, coverImg, description, location } = req.body;
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
    if (err) {
      res.status(400).json({
        error: 'Failed to upload an image'
      });
    } else {
      res.status(200).json();
    }
  });

});

// TO UPLOAD AN IMAGE to a path(param)
app.post('/api/post/image/:path', (req, res) => {
  const folder = `./server/public/images/${req.params.path}`;
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({
    limits: {
      fileSize: 1000000
    },
    storage: storage,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        return cb(new Error('Please upload a jpg., .jpeg, or .png file'));
      }
      cb(undefined, true);
    }
  }).single('image');
  upload(req, res, function (err) {
    // USER CAN CREATE A POST
    const {
      sellerId,
      description,
      imageUrl,
      title,
      startingBid,
      biddingEnabled,
      isDeleted,
      expiredAt,
      notes,
      category
    } = req.body;
    if (
      !sellerId ||
      !description ||
      !imageUrl ||
      !title ||
      !startingBid ||
      !biddingEnabled ||
      !isDeleted ||
      !expiredAt ||
      !notes ||
      !category
    ) {
      return res.status(404).json({
        error: 'Some fields are missing!'
      });
    }
    const sql = `
    INSERT INTO "post" ("sellerId", "description", "imageUrl", "title", "startingBid", "biddingEnabled", "isDeleted", "expiredAt","notes","category", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())
      RETURNING "postId"
  `;
    const params = [
      sellerId,
      description,
      imageUrl,
      title,
      startingBid,
      biddingEnabled,
      isDeleted,
      expiredAt,
      notes,
      category
    ];
    db.query(sql, params)
      .then(result => {
        const post = result.rows[0];
        if (!post) {
          return res.status(400).json({
            error: 'Failed to create post'
          });
        } else {
          return res.json(post);
        }
      })
      .catch(err => {
        return res.status(500).json({
          error: `An unexpected error occurred. ${err.message}`
        });
      });

    if (err) {
      return res.status(400).json({
        error: 'Failed to upload an image'
      });
    } else {
      return res.status(200).json();
    }
  });
});

// USER CAN VIEW ALL POSTS
app.get('/api/posts/:category/:offset', (req, res, next) => {
  const category = req.params.category;
  const offset = req.params.offset;
  const sql = `
    select "postId",
           "imageUrl",
           "createdAt"
    from  "post"
    where "category" = $1
    order by "createdAt" desc
    limit 10 offset $2
  `;
  const params = [category, offset];
  db.query(sql, params)
    .then(result => {
      const posts = result.rows;
      if (posts.length === 0) {
        return res.status(404).json({
          error: `There are no more posts with the category ${category}`
        });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: `An unexpected error occurred. ${err.message}`
      });
    });
});

// TO UPLOAD IMAGE FOR EDIT POST
app.post('/api/edit/post/image/:path', (req, res) => {
  const folder = `./server/public/images/${req.params.path}`;
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({
    limits: {
      fileSize: 10000000
    },
    storage: storage,
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        return cb(new Error('Please upload a jpg., .jpeg, or .png file'));
      }
      cb(undefined, true);
    }
  }).single('image');
  upload(req, res, function (err) {
    // USER CAN EDIT A POST
    const {
      postId,
      description,
      // imageUrl,
      title,
      startingBid,
      biddingEnabled,
      isDeleted,
      expiredAt,
      category,
      notes
    } = req.body;
    const sql = `
      UPDATE "post"
         SET "description" = $1,
             "title" = $2,
             "startingBid" = $3,
             "biddingEnabled" = $4,
             "isDeleted" = $5,
             "expiredAt" = $6,
             "category" = $7,
             "notes" = $8
      WHERE "postId" = $9
      RETURNING *
  `;
    const params = [
      description,
      title,
      startingBid,
      biddingEnabled,
      isDeleted,
      expiredAt,
      category,
      notes,
      postId
    ];
    db.query(sql, params)
      .then(result => {
        const post = result.rows[0];
        if (!post) {
          return res.status(400).json({
            error: 'Failed to update post'
          });
        } else {
          return res.status(202).json(post);
        }
      })
      .catch(err => {
        return res.status(500).json({
          error: `An unexpected error occurred. ${err.message}`
        });
      });
    if (err) {
      return res.status(400).json({
        error: 'Failed to upload an image'
      });
    } else {
      return res.status(200).json();
    }
  });
});

// USER CAN SEND A PRIVATE MESSAGE
app.post('/api/message/', (req, res, next) => {
  const { senderId, recipientId, postId, message } = req.body;
  const sql = `
    INSERT INTO "message" ("senderId", "recipientId", "postId", "message", "createdAt")
         VALUES ($1, $2, $3, $4, now())
      RETURNING *
  `;
  const params = [senderId, recipientId, postId, message];
  db.query(sql, params)
    .then(result => {
      const message = result.rows[0];
      if (!message) {
        return res.status(400).json({
          error: `Failed to send a message ${message}`
        });
      } else {
        return res.status(202).json(message);
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: `An unexpected error occurred. ${err.message}`
      });
    });
});
// USER CAN VIEW THE LISTS OF RECEIVED PRIVATE MESSAGES
app.post('/api/message/list/', (req, res, next) => {
  const { recipientId, senderId } = req.body;
  if (!recipientId && !senderId) {
    return res.status(400).json({
      error: 'userId is required'
    });
  }
  const sql = `
      SELECT "me"."senderName", "me"."senderId", "me"."recipientId", "me"."postId", "me"."message", "me"."createdAt" FROM (
      SELECT DISTINCT ON ("m"."senderId", "m"."recipientId", "m"."postId") "u"."userName" AS "senderName", "m"."senderId", "m"."recipientId", "m"."postId", "m"."message", "m"."createdAt"
      FROM "message" AS "m"
      JOIN "user" AS "u"
      ON "u"."userId" = "m"."senderId"
      WHERE "m"."recipientId" = $1 OR "m"."senderId" = $1
      ORDER BY "m"."senderId", "m"."recipientId", "m"."postId" DESC) AS "me"
      ORDER BY "me"."createdAt" DESC
  `;
  const params = [recipientId];
  db.query(sql, params)
    .then(result => {
      const message = result.rows;
      if (!result.rows[0]) {
        return res.status(400).json({
          error: 'You don\'t have a received message'
        });
      } else {
        return res.status(200).json(message);
      }
    })
    .catch(err => {
      return res.status(500).send({
        error: `An unexpected error occurred. ${err.message}`
      });
    });
});
// USER CAN VIEW THE MESSAGES FROM A USER
app.post('/api/message/detail/', (req, res, next) => {
  const { recipientId, senderId, postId } = req.body;
  if (!recipientId) {
    return res.status(400).json({
      error: 'userId is required'
    });
  }
  if (!senderId) {
    return res.status(400).json({
      error: 'senderId is required'
    });
  }
  if (!postId) {
    return res.status(400).json({
      error: 'postId is required'
    });
  }
  const sql = `
      SELECT "u"."userName" AS "senderName", "m"."recipientId", "m"."senderId", "m"."postId", "m"."message", "m"."createdAt"
        FROM "message" AS "m"
        JOIN "user" AS "u"
          ON "u"."userId" = "m"."senderId"
       WHERE (("m"."recipientId" = $1 AND "m"."senderId" = $2)
         OR ("m"."recipientId" = $2 AND "m"."senderId" = $1))
         AND "m"."postId" = $3
    ORDER BY "m"."createdAt" ASC
  `;
  const params = [recipientId, senderId, postId];
  db.query(sql, params)
    .then(result => {
      const message = result.rows;
      if (!result.rows[0]) {
        return res.status(404).json({
          error: `You don't have a received message from user ${senderId}`
        });
      } else {
        return res.status(200).json(message);
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: `An unexpected error occurred. ${err.message}`
      });
    });
});
// USER CAN VIEW A SPECIFIC POST - the post details + username
app.get('/api/viewpost/:postId', (req, res, next) => {
  const postId = Number(req.params.postId);
  if (!Number.isInteger(postId) || postId < 0) {
    return res.status(400).json({ error: 'postId must be a positive integer' });
  }
  const sql = `
    select "post".*,
           "user"."userName"
    from "post" join "user" on "post"."sellerId" = "user"."userId"
    where "post"."postId" = $1
  `;
  const params = [postId];
  db.query(sql, params)
    .then(result => {
      const post = result.rows[0];
      if (!post) {
        return res.status(404).json({
          error: `Cannot find post with "postId" ${postId}`
        });
      } else {
        return res.status(200).json(post);
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: `An unexpected error occurred. ${err.message}`
      });
    });
});

// USER CAN VIEW THE POSTS IN MY WATCHLIST
// This should be refactored using req.session.userId(if it's possible)
// Also ths endpoint name should be changed to /api/watchlists, but careful to use same endpoint
app.get('/api/watchlist/:userId', (req, res, next) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId < 0) {
    return res.status(400).json({ error: 'userId must be a positive integer' });
  }
  const sql = `
    SELECT "p".*
    FROM "post" AS "p"
    JOIN "watchlists" AS "w"
    ON "p"."postId" =  "w"."postId"
    WHERE "userId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      return res.status(200).json(result.rows);
    })
    .catch(err => {
      return res.status(500).json({
        error: `An unexpected error occurred ${err.message}`
      });
    });
});

// USER CAN VIEW A SPECIFIC POST - the watchlist counts
app.get('/api/watchlistcounts/:postId', (req, res, next) => {
  const postId = Number(req.params.postId);
  if (!Number.isInteger(postId) || postId < 0) {
    return res.status(400).json({ error: 'postId must be a positive integer' });
  }
  const sql = `
    select count(*) as "totalWatchlisters"
    from "watchlists"
    where "postId" = $1
  `;
  const params = [postId];
  db.query(sql, params)
    .then(result => {
      const watchlistCounts = result.rows[0];
      return res.status(200).json(watchlistCounts);
    })
    .catch(err => {
      return res.status(500).json({
        error: `An unexpected error occurred ${err.message}`
      });
    });
});

// USER CAN VIEW A SPECIFIC POST - bid info
app.get('/api/bidinfo/:postId', (req, res, next) => {
  const postId = Number(req.params.postId);
  if (!Number.isInteger(postId) || postId < 0) {
    return res.status(400).json({ error: 'postId must be a positive integer' });
  }
  const sql = `
    select count(*) as "totalBids",
    max ("currentBid") as "highestBid"
    from "bid"
    where "postId" = $1
  `;
  const params = [postId];
  db.query(sql, params)
    .then(result => {
      const bidInfo = result.rows[0];
      return res.status(200).json(bidInfo);
    })
    .catch(err => {
      return res.status(500).json({
        error: `An unexpected error occurred. ${err.message}`
      });
    });
});

// USER CAN VIEW A SPECIFIC POST - bid history
app.get('/api/bidhistory/:postId', (req, res, next) => {
  const postId = Number(req.params.postId);
  if (!Number.isInteger(postId) || postId < 0) {
    return res.status(400).json({ error: 'postId must be a positive integer' });
  }
  const sql = `
    select "bid"."bidId", "bid"."bidderId", "bid"."currentBid", "bid"."createdAt","user"."userName"
    from "bid" join "user" on "bid"."bidderId" = "user"."userId"
    where "bid"."postId" = $1
    order by "bidId" asc
  `;
  const params = [postId];
  db.query(sql, params)
    .then(result => {
      const bidInfo = result.rows;
      return res.status(200).json(bidInfo);
    })
    .catch(err => {
      res.status(500).json({
        error: `An unexpected error occurred. ${err.message}`
      });
    });
});

// USER CAN VIEW A SPECIFIC POST - notes
app.get('/api/notes/:postId', (req, res, next) => {
  const postId = Number(req.params.postId);
  if (!Number.isInteger(postId) || postId < 0) {
    return res.status(400).json({ error: 'postId must be a positive integer' });
  }
  const sql = `
  select "notes"
  from "post"
  where "postId" = $1
  `;
  const params = [postId];
  db.query(sql, params)
    .then(result => {
      const notes = result.rows[0].notes;
      return res.status(200).json(notes);
    })
    .catch(err => {
      res.status(500).json({
        error: `An unexpected error occurred. ${err.message}`
      });
    });
});

// USER CAN VIEW POSTS ON PROFILE
app.get('/api/posts', (req, res, next) => {
  const userId = [req.session.userInfo.userId];
  const findUserPosts = `
  SELECT  "postId", "imageUrl"
  FROM    "post"
  WHERE   "sellerId" = $1
  `;
  db.query(findUserPosts, userId)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

// USER CAN BID ON ART
app.post('/api/bid', (req, res, next) => {
  const { bidderId, postId, currentBid } = req.body;
  if (!bidderId || !postId || !currentBid) {
    return res.status(400).json({
      error: 'Must be logged in and add a bid price'
    });
  } else if (isNaN(Number(currentBid)) || Number(currentBid) < 0) {
    return res.status(400).json({
      error: 'currentBid must be a postive number'
    });
  }
  const sql = `
  select "postId", "currentBid", "bidderId"
  from "bid"
  where "postId" = $1
  and "currentBid" >= $2
  order by "currentBid" desc
  `;
  const params = [postId, currentBid];
  db.query(sql, params)
    .then(result => {
      const higherBid = result.rows[0];
      if (higherBid) {
        return res.status(403).json({
          error: `Bid placed must be higher than current highest bid: $${higherBid.currentBid}`
        });
      } else if (!higherBid) {
        const sql = `
        select "startingBid"
        from "post"
        where "postId" = $1
        `;
        const params = [postId];
        db.query(sql, params)
          .then(result => {
            const post = result.rows[0];
            if (currentBid < post.startingBid) {
              return res.status(403).json({
                error: `Bid placed must be higher than current highest bid: $${post.startingBid}`
              });
            } else {
              const sql = `
                insert into "bid" ("bidderId", "postId", "currentBid")
                values ($1, $2, $3)
                RETURNING *
              `;
              const params = [bidderId, postId, currentBid];
              db.query(sql, params)
                .then(result => {
                  const bid = result.rows[0];
                  res.status(202).json(bid);
                });
            }
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

const getSQLWatchLists = `select *
          from "watchlists"
          where "userId" = $2 and "postId" = $1;`;

function getUserIdParams(postId, req) {
  if (postId && req && req.session && req.session.userInfo && req.session.userInfo.userId) {
    return [`${Number(postId)}`, `${req.session.userInfo.userId}`];
  }
}

// USER GETS SPECIFIC ITEM IN WATCHLIST
app.get('/api/watchlists/:postId', (req, res, err) => {
  const { postId } = req.params;
  const params = getUserIdParams(postId, req);
  if (params) {
    db.query(getSQLWatchLists, params).then(result => {
      const watchlistObject = result && result.rows && result.rows[0];
      if (watchlistObject) {
        res.send({ status: 'successful', watchListItem: watchlistObject });
      } else {
        res.send({ status: 'does not exist', watchListItem: null });
      }
    });
  } else {
    res.send({ status: 'does not exist' });
  }
});

// USER CAN ADD TO WATCHLISTS
app.post('/api/watchlists/:postId', (req, res, err) => {
  const { postId } = req.params;

  const params = getUserIdParams(postId, req);

  db.query(getSQLWatchLists, params)
    .then(result => {
      const watchlistObject = result && result.rows && result.rows[0];
      if (!watchlistObject) {
        const sql2 = `
        INSERT INTO "watchlists" ("postId","userId")
             values ($1, $2)
             returning *`;
        db.query(sql2, params).then(data => {
          return res.json({ status: 'inserted' });
        });
      } else {
        const sql3 = `
        delete from "watchlists"
        where "userId"= $2 and "postId" = $1`;
        db.query(sql3, params).then(data => {
          return res.json({ status: 'deleted' });
        });
      }
    })
    .catch(err => {
      console.error(err);
      return res.send({ message: err });
      // res.status(500).json({ error: 'An unexpected error occurred' });
    });
});

// USER CAN VIEW THE POSTS THAT THEY HAVE BIDDED ON
// Currently designed to use params.usedId. Please change it to req.session.userId if you want
app.get('/api/bids/:userId', (req, res, next) => {
  // const userId = Number(req.session.userId);
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId < 0) {
    return res.status(400).json({ error: 'userId must be a positive integer' });
  }
  const sql = `
    SELECT "p".*
    FROM "post" AS "p"
    JOIN "bid" AS "b"
    ON "p"."postId" =  "b"."postId"
    WHERE "bidderId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      return res.status(200).json(result.rows);
    })
    .catch(err => {
      return res.status(500).json({
        error: `An unexpected error occurred ${err.message}`
      });
    });
});

// HEALTH CHECK
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
    return res.status(err.status).json({ error: err.message });
  } else {
    return res.status(500).json({
      error: `An unexpected error occurred. ${err.message}`
    });
  }
});
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('[http] Server listening on port', process.env.PORT);
});
