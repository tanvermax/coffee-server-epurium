const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();


// midddlewere 

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.toqnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection("coffee");

    const userCollection = client.db('coffeeDB').collection("users")


    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })


    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;

      console.log(newCoffee);

      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);

    })



    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const qeuery = { _id: new ObjectId(id) }
      const coffee = await coffeeCollection.findOne(qeuery);
      res.send(coffee)
    })



    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true };
      const updatedcoffee = req.body;
      const coffee = {
        $set: {
          name: updatedcoffee.name,
          shape: updatedcoffee.shape,
          supplier: updatedcoffee.supplier,
          test: updatedcoffee.test,
          category: updatedcoffee.category,
          details: updatedcoffee.details,
          photourl: updatedcoffee.photourl,

        }

      }
      const result = await coffeeCollection.updateOne(filter, coffee, option);
      res.send(result)
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      console.log("plese delet this from database ", id);
      const qeuery = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(qeuery);
      res.send(result)

    })


    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("new user is",newUser);

      const result = await userCollection.insertOne(newUser);
      res.send(result)
    })
    // user list
    app.get('/users', async (req,res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.delete("/users/:id", async (req,res)=>{
      const id = req.params.id;
      console.log("pleaase delet this", id);
      const qeuery = {_id : new ObjectId(id)}
      const result = await userCollection.deleteOne(qeuery);
      res.send(result);
      
    })

    app.patch('/users' , async (req,res)=>{
      const email = req.body.email;
      const filter = {email};

      const updatedDoc = {
        $set: {
          lastSignInTime : req.body.lastSignInTime,
        }
      }
      const result = await userCollection?.updateOne(filter,updatedDoc)

        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('coffee makign server is running server is running ')

})

app.listen(port, () => {
  console.log(`coffee making server is running ${port}`);

})