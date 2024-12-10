import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); 

const app = express();
const PORT = 5000;
const MONGO_URL = process.env.MONGO_URL; 

app.use(cors()); 
app.use(express.json()); 


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


const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  age: Number,
  dept: String,
  gender: String,
});

const userModel = mongoose.model('sdata', userSchema, 'sdata'); 


app.get('/getUsers', async (req, res) => {
  try {
    const users = await userModel.find(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/getUser/:id', (req, res) => {
  const userId = req.params.id; 
  userModel.findOne({ id: userId }) 
    .then(user => {
      if (user) {
        res.json(user); 
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});
