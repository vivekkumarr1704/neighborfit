const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Schema
const neighborhoodSchema = new mongoose.Schema({
  name: String,
  city: String,
  safety_score: Number,
  cost_score: Number,
  amenities_count: Number,
  walkability_score: Number
});
const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);

// Connect to MongoDB (replace <user> and <password> with your MongoDB Atlas credentials)
mongoose.connect('mongodb+srv://<user>:<password>@cluster0.mongodb.net/neighborfit?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Fetch and store sample data (simplified for demo)
async function fetchData() {
  try {
    // Placeholder for OpenStreetMap or city API call
    const response = await axios.get('https://api.openstreetmap.org/...'); // Replace with actual API
    const data = response.data;
    // Process and normalize data
    const neighborhoods = data.map(item => ({
      name: item.name || 'Unknown',
      city: item.city || 'Unknown',
      safety_score: item.safety_score || Math.random(),
      cost_score: item.cost_score || Math.random(),
      amenities_count: item.amenities_count || Math.floor(Math.random() * 10),
      walkability_score: item.walkability_score || Math.random()
    }));
    await Neighborhood.insertMany(neighborhoods);
  } catch (error) {
    console.error('Data fetch error:', error);
  }
}

// Matching endpoint
app.post('/match', async (req, res) => {
  const { safety_weight, cost_weight, amenities_weight, walkability_weight } = req.body;
  const neighborhoods = await Neighborhood.find();
  const scores = neighborhoods.map(n => ({
    name: n.name,
    score: (safety_weight * n.safety_score) +
           (cost_weight * n.cost_score) +
           (amenities_weight * n.amenities_count) +
           (walkability_weight * n.walkability_score)
  }));
  scores.sort((a, b) => b.score - a.score);
  res.json(scores.slice(0, 5));
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
  fetchData();
});