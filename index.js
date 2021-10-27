const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4500;

// middleware
app.use(cors());
app.use(express.json());

// sequrity code 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cyq7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
   try{
        await client.connect();
    //    create data base 
    const database = client.db("carMechanic");
    // data base Collection
    const servicesCollection = database.collection("services");


    // GET API All Services 
    app.get('/services', async(req,res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    })

    // GET API SINGLE SERVICE DETAILS 
    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service)
    })

    // DELETE API 
    app.delete('/services/:id',async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await servicesCollection.deleteOne(query);
        res.json(result)
    })

    // POST API 
    app.post('/services',async (req,res)=>{
        const service = req.body;

        console.log('hit the post',service);
        const result = await servicesCollection.insertOne(service);
        console.log(result);
        res.json(result)
    })


    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir)

// check port 
app.get('/', (req,res) => {
res.send("Genius car is running")
})

// set port 
app.listen(port,()=>{
    console.log('port is running', port);
})

