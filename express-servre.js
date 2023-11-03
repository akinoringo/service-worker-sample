const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.json());

app.post('/log', (req, res) => {
  const message = req.body.message;
  console.log('Message from client:', message);
  res.send('Logged');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
