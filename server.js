const express = require('express');
const mongoose = require('mongoose');

// port
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connection to MongoDB
const connectionStringURI = 'mongodb://127.0.0.1:27017/social_network';

mongoose.connect(connectionStringURI);
mongoose.connection.once('open', () => {
  console.log('Mongoose is connected to MongoDB.');
});

// route
app.get('/', (req, res) => {
  res.send('API is running!');
});

// server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
