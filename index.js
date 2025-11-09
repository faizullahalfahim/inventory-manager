const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})







const uri = "mongodb+srv://inventory-maneger:0YANjgYKVR8u7rKn@datafast.dq4p809.mongodb.net/?appName=datafast";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();


   const db = client.db("inventory-db");
   const modelsCollection = db.collection("model");

   app.get( '/models', async(req, res) => {
    const models = await modelsCollection.find().toArray();
    res.send(models)
   });


    




  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
