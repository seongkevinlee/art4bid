const pg = require('pg');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// eslint-disable-next-line no-console
console.log(`trying to connect DB: ${process.env.DATABASE_URL}`);

db.connect(err => {
  // eslint-disable-next-line no-console
  console.log('connecting');
  if (err) {
    console.error('DB connection error', err.stack);
  } else {
    // eslint-disable-next-line no-console
    console.log('DB connection is successful.');
  }
});
module.exports = db;
