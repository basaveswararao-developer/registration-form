const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;


// Connect mongoose
mongoose.connect("mongodb+srv://nbasaveswararao07:H9LqZdNZDk0ygAOB@cluster0.ff9yrct.mongodb.net/registrationFormDB", {
  connectTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000,  // 45 seconds
});


const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoClient = new MongoClient("mongodb+srv://nbasaveswararao07:H9LqZdNZDk0ygAOB@cluster0.ff9yrct.mongodb.net/registrationFormDB", {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await mongoClient.connect();
        // Send a ping to confirm a successful connection
        await mongoClient.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoClient.close();
    }
}
run().catch(console.dir);


const registrationSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true }, // Find email was true & email uniqueness
  password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

app.post('/register', async (req, res) => {
  try {
      const { name, email, password } = req.body;

      // Check if the user with the same email already exists
      const existingUser = await Registration.findOne({ email });

      if (existingUser) {
          // User exists, check the password
          if (existingUser.password === password) {
              // Password is correct, redirect to success page
              console.log("user currect")
              res.redirect('/success');
          } else {
              // Password is incorrect, redirect to error page
              console.log("Incorrect password");
              res.redirect('/error');
          }
      } else {
          // User doesn't exist, proceed with registration
          const registrationData = new Registration({
              name,
              email,
              password
          });

          await registrationData.save();
          res.redirect('/success');
      }

  } catch (error) {
      console.error(error);
      res.redirect('/error');
  }
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get('/error', (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

