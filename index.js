const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 3010;


const app = express()
app.use(cors());
app.use(bodyParser.json());

// app.use(express.json()),
//     app.use(express.urlencoded({ extended: false }))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.smblb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    console.log('connect err', err);
    const EventCollection = client.db("helpNetwork").collection("events");
    const registrationCollection = client.db("helpNetwork").collection("registration");
    console.log('Database connected');

    app.post('/add-event', (req, res) => {
        const newEvent = req.body;
        // console.log(newEvent);
        EventCollection.insertOne(newEvent)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/events', (req, res) => {
        EventCollection.find()
            .toArray((err, result) => {
                res.send(result);
            })
    })

    app.post('/form-submit', (req, res) => {
        registrationCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/registered-event', (req, res) => {
        registrationCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.delete('/cancelEvent/:id', (req, res) => {
        console.log(req.params.id);
        registrationCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
                res.send(result.deletedCount > 0);
            })
    })
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)