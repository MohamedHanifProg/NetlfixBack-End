// server.js
const express = require('express');
const connectDB = require('./db_connection');

const app = express();


connectDB();


app.use(express.json());


app.get('/', (req, res) => {
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
