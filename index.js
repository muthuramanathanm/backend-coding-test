'use strict';

const express = require('express');
const app = express();
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');
const dbOps = require('./src/readWrites');

db.serialize(() => {
    buildSchemas(db);
    // dbOps(db);

    const app = require('./src/app')(db);
    console.log('Hello...');
    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});