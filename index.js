/* eslint-disable no-param-reassign */

import monk from 'monk';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const MONGO_URL = 'localhost:27017';
const DATABASE_NAME = 'timeline-calculator';

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

let mongoClient;
let db;

/**
 * @returns {Promise<import('monk').IMonkManager>}
 */
const getMonkClient = async () => {
  if (!db) {
    return new Promise((resolve, reject) => {
      console.log('Connecting to Mongo');
      const connection = monk(`${MONGO_URL}/${DATABASE_NAME}`);
      connection.then = null;

      connection.once('open', () => {
        db = connection;
        resolve(db);
      });
      connection.once('error-opening', reject);
    });
  } else {
    return db;
  }
};

app.get('/', async (req, res) => {
  const db = await getMonkClient();
  const variables = await db.get('variables').find();
  res.json(variables);
});
app.get('/variable/:id', async (req, res) => {
  const db = await getMonkClient();
  const variables = await db.get('variables').find({ id: req.params.id });
  res.json(variables);
});

app.post('/variable', async (req, res) => {
  const db = await getMonkClient();
  const body = req.body;
  if (body.id === '') {
    res.statusCode = 400;
    res.statusMessage = 'id Cannot be empty';
  } else if (body.name === '') {
    res.statusCode = 400;
    res.statusMessage = 'name Cannot be empty';
  } else {
    const idExists = await db.get('variables').find({ id: body.id });
    if (!idExists.length) {
      body.timeValues = [];
      await db.get('variables').insert(body);
      console.log(`Inserted ${body.name}`);
    } else {
      console.log(`ID '${body.id}' Exists`);
      res.statusCode = 422;
      res.statusMessage = 'A Variable with that ID already exists';
    }
  }
  res.send();
});

app.patch('/variable', async (req, res) => {
  const db = await getMonkClient();
  const body = req.body;
  if (body.id === '') {
    res.statusCode = 400;
    res.statusMessage = 'id Cannot be empty';
  } else if (body.name === '') {
    res.statusCode = 400;
    res.statusMessage = 'name Cannot be empty';
  } else {
    const idExists = await db.get('variables').find({ id: body.id });
    console.log(body);
    if (idExists.length) {
      await db
        .get('variables')
        .findOneAndUpdate(
          { id: body.id },
          { $set: { timeValues: body.timeValues, name: body.name } }
        );
      console.log(`Updated ${body.name}`);
    } else {
      console.log(`ID '${body.id}' does not Exists`);
      res.statusCode = 422;
      res.statusMessage = "A Variable with that ID doesn't exists";
    }
  }
  res.send();
});
app.delete('/variable', async (req, res) => {
  const db = await getMonkClient();
  const body = req.body;
  const idExists = await db.get('variables').find({ id: body.id });
  if (idExists.length) {
    await db.get('variables').remove({ id: body.id });
    console.log(`Deleted ${body.id}`);
  } else {
    console.log(`ID '${body.id}' does not exists`);
    res.statusCode = 422;
  }
  res.send();
});

app.listen(8000, () => {
  console.log('Listening at port 8000');
});
