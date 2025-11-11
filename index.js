const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri =
  "mongodb+srv://inventory-maneger:0YANjgYKVR8u7rKn@datafast.dq4p809.mongodb.net/?appName=datafast";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("inventory-db");
    const modelsCollection = db.collection("model");

    //find method
    app.get("/models", async (req, res) => {
      const models = await modelsCollection.find().toArray();
      res.send(models);
    });

    //find single item
    app.get("/models/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const result = await modelsCollection.findOne({ _id: new ObjectId(id) });
      res.send({
        // success: true,
        result,
      });
    });

    //post method
    app.post("/models", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await modelsCollection.insertOne(req.body);
      res.send({
        success: true,
      });
    });

    //update method
    app.put("/models/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      console.log(id);
      console.log(data);
      const Id = new ObjectId(id);
      const filter = { _id: Id}
      const update = {
        $set: data
      }
      const result = await modelsCollection.updateOne(filter, update);

      res.send({
        success: true,
        result,
      });
    });
    // Delete Method
    

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
