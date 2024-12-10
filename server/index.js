import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // Load .env file

const app = express();
const PORT = 5000; // Use port from .env or default to 8001
const MONGO_URL = process.env.MONGO_URL; // MongoDB URL from .env

app.use(cors()); // Enable CORS to allow requests from the frontend
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define the User Schema and Model
const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  age: Number,
  dept: String,
  gender: String,
});

const userModel = mongoose.model('sdata', userSchema, 'sdata'); // Collection name is 'sdata'

// Routes
app.get('/getUsers', async (req, res) => {
  try {
    const users = await userModel.find(); // Fetch all users
    res.json(users); // Send users as JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/getUser/:id', (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL
  userModel.findOne({ id: userId }) // Find user by ID
    .then(user => {
      if (user) {
        res.json(user); // Send user data
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
