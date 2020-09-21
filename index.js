import { default as mongodb } from 'mongodb';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const MONGO_URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'timeline-calculator';

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

let mongoClient;

const getMongoClient = async () => {
  if (!mongoClient) {
    mongoClient = await mongodb.MongoClient.connect(MONGO_URL, {
      useUnifiedTopology: true,
    });
  }
  return { client: mongoClient, database: mongoClient.db(DATABASE_NAME) };
};

const closeMongoClient = () => {
  if (mongoClient) {
    mongoClient.close();
  }
};

app.get('/', async (req, res) => {
  const { database } = await getMongoClient();
  const variables = await database.collection('variables').find().toArray();
  res.json(variables);
});

app.post('/variable', async (req, res) => {
  const { database } = await getMongoClient();
  const body = req.body;
  if (body.id === '') {
    res.statusCode = 400;
    res.statusMessage = 'id Cannot be empty';
  } else if (body.name === '') {
    res.statusCode = 400;
    res.statusMessage = 'name Cannot be empty';
  } else {
    const idExists = await database
      .collection('variables')
      .find({ id: body.id })
      .toArray();
    if (!idExists.length) {
      await database.collection('variables').insertOne(body);
      console.log(`Inserted ${body.name}`);
    } else {
      console.log(`ID '${body.id}' Exists`);
      res.statusCode = 422;
      res.statusMessage = 'A Variable with that ID already exists';
    }
  }
  res.send();
});
app.delete('/variable', async (req, res) => {
  const { database } = await getMongoClient();
  const body = req.body;
  console.log(req);
  const idExists = await database
    .collection('variables')
    .find({ id: body.id })
    .toArray();
  if (idExists.length) {
    await database.collection('variables').deleteOne({ id: body.id });
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
