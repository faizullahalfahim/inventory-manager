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
    const purchaseCollection = db.collection("purchase");

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
      const filter = { _id: Id };
      const update = {
        $set: data,
      };
      const result = await modelsCollection.updateOne(filter, update);
      res.send({
        success: true,
        result,
      });
    });
    // Delete Method

    app.delete("/models/:id", async (req, res) => {
      const { id } = req.params;
      // const Id = new ObjectId (id)
      // const filter =  {_id: Id}
      const result = await modelsCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({
        success: true,
        result,
      });
    });

    //latest data get method
    app.get("/latest-models", async (req, res) => {
      const result = await modelsCollection
        .find()
        .sort({ createdAt: "asc" })
        .limit(6)
        .toArray();
      res.send(result);
    });

    //get data by user for myModels
    app.get("/my-models", async (req, res) => {
      const email = req.query.email;
      const result = await modelsCollection
        .find({ createdBy: email })
        .toArray();
      res.send(result);
    });

    //get data for purchased model
    app.get("/my-purchase", async (req, res) => {
      const email = req.query.email;
      const result = await purchaseCollection
        .find({ downloaded_By: email })
        .toArray();
      res.send(result);
    });

    //post data for my model purchase page
    app.post("/purchase:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const result = await purchaseCollection.insertOne(data);
      const filter = {_id: new ObjectId (id)}
      const update = {
        $inc: {
          purchased: 1
        }
      }
      const downloadCounted = await modelsCollection.updateOne (filter,update)
      res.send(result, downloadCounted);
    });

    //get data for search bar
    app.get ('/search', async(req, res) => {
      const search_text = req.query.search
      const result =await modelsCollection.find({name: {$regex: search_text, $options:"i"}}).toArray()
      res.send(result)

    } )

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
