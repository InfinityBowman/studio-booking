const db = require('./db');
require('dotenv').config({ path: '../.env.local' });

// run with node createTables.js

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );
  `;

  try {
    await db.query(queryText);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables', err);
  }
};

createTables();
