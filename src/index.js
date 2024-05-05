const express = require('express');
const bodyParser = require('body-parser');
const deviceRouter = require('./device_router');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Route for device endpoints
app.use('/devices', deviceRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.send('Hello! Please proceed to the /devices endpoint.')
  })




