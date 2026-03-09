// database/setup.js — Run this script once to initialize the database
const fs = require('fs');
const path = require('path');
const { pool } = require('./index');

async function setup() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('✅ Database schema applied successfully');
  } catch (err) {
    console.error('❌ Database setup failed:', err.message);
  } finally {
    await pool.end();
  }
}

setup();
