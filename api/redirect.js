const express = require('express');
const path = require('path');
const app = express();

// Serve the QR code image
app.get('/frame.png', (req, res) => {
  res.sendFile(path.join(__dirname, '../frame.png'));
});

// Redirect any other request to your website
app.get('*', (req, res) => {
  res.redirect('https://meadowswedding2025.com');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});