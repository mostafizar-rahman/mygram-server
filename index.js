const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
require('dotenv').config()
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oz1ak5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const postCollections = client.db('mygram').collection('post')
const userCollections = client.db('mygram').collection('user')

async function run() {
    app.post('/user', async (req, res) => {
        const user = req.body
        console.log(user)
        const result = await userCollections.insertOne(user)
        res.send(result)
    })
    app.get('/user', async (req, res) => {
        const email = req.query.email
        console.log(email)
        const filter = { email: email }
        const user = await userCollections.findOne(filter)
        res.send(user)
    })
    app.put('/user', async (req, res) => {
        const id = req.query.id
        const userNewInfo = req.body
        console.log(userNewInfo)
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true }
        const updateDoc = {
            $set: userNewInfo,
        };
        const result = await userCollections.updateOne(filter, updateDoc, options);
        console.log(result)
        res.send(result)
    })

    app.post('/post', async (req, res) => {
        const post = req.body
        const result = await postCollections.insertOne(post)
        res.send(result)
    })
    app.get('/post', async (req, res) => {
        const query = {}
        const result = await postCollections.find(query).sort({ time: -1 }).toArray()
        res.send(result)
    })
    app.get('/postDetailes/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const filter = { _id: ObjectId(id) }
        const result = await postCollections.findOne(filter)
        console.log(result)
        res.send(result)
    })
    app.patch('/comment', async (req, res) => {
        const id = req.query.id
        const commentInfo = req.body
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true }
        const updateDoc = {
            $set: {
                comment: [commentInfo]
            },
        };
        const result = await postCollections.updateOne(filter, updateDoc, options);
        res.send(result)
    })
    app.patch('/like', async (req, res) => {
        const id = req.query.id
        const likeInfo = req.body
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true }
        const updateDoc = {
            $set: {
                like: [likeInfo]
            },
        };
        const result = await postCollections.updateOne(filter, updateDoc, options);
        console.log(result)
        res.send(result)
    })
    app.get('/like', async (req, res) => {
        const filter = {}
        const result = await postCollections.find(filter).toArray()
        console.log(result)
        res.send(result)
    })
}
run().catch(console.dir())

app.get('/', (req, res) => {
    res.send('Hello Developer')
})

app.listen(port, () => {
    console.log('Port runing port', port)
})