const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pwyhut1.mongodb.net/?retryWrites=true&w=majority`;


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

    const roomsCollection = client.db('SuiteVoyageDB').collection('roomsCollection');
    const bookingsCollection = client.db('SuiteVoyageDB').collection('bookingsCollection');
    const reviewCollection = client.db('SuiteVoyageDB').collection('reviewCollection');

    //rooms section
    app.get('/rooms', async (req, res) => {
      const cursor = roomsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/rooms/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await roomsCollection.findOne(query)
      res.send(result)
    })


    //bookings section

    app.post('/bookings', async (req, res) => {
      const booking = req.body
      const result = await bookingsCollection.insertOne(booking)
      res.send(result)
    });


    app.get('/bookings', async (req, res) => {
      console.log(req.query.email)
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = await bookingsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingsCollection.findOne(query);
      res.send(result);
    })

    app.patch('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updated = req.body;
     console.log(updated)
      const updateDoc = {
          $set: {
            RoomId: updated.RoomId,
            date: updated.date,
            Type: updated.Type,
             Number: updated.Number,
              Price: updated.Price, 
              Name: updated.Name, 
              email:updated.email,
              Image: updated.email
          },
      };
      const result = await bookingsCollection.updateOne(filter, updateDoc);
      res.send(result);
  })


    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    })
  
  //review 

  app.post('/review', async (req, res) => {
    const booking = req.body
    const result = await reviewCollection.insertOne(booking)
    res.send(result)
  });

  app.get('/review', async (req, res) => {
    const cursor = reviewCollection.find();
    const result = await cursor.toArray();
    res.send(result);
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
  res.send('SuiteVoyage Server Running');
})


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})