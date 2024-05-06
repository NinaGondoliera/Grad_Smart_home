const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });
const database = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Route for device endpoints
app.get('/devices', (req, res) => {
  const errorMessage = 'Unable to retrieve devices.';
  let responseMessage = `
    <h1>Hello! Your currently connected devices:</h1><br>
  `;
  const params = {
    TableName: "Devices"
  };
  
  database.scan(params, function (err, data) {
    if (err) {
      console.log("Cannot list items", err);
      res.status(500).json({ error: "Unable to list items" });
    } else {
      console.log("Successfully listed items", JSON.stringify(data));
      data.Items.forEach(function (element, index, array) {
        const itemDetails = `name: ${element.name.S}; state: ${element.state.S}`;
        console.log("printing", itemDetails);
        responseMessage += `<p>${itemDetails}</p>`;
      });

      res.status(200).send(responseMessage);
    }
  }); 
});

// Endpoint to disconnect a device
app.delete('/devices/:name', (req, res) => {
  console.log(req.params);
  const device_name = req.params.name;

  const params = {
    TableName: "Devices",
    Key: {
      name: { S: device_name },
    },
  };
  
  database.deleteItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.status(500).json({ message: "Unable to disconnect device" })
    } else {
      console.log("Success", data);
      res.status(200).json({ message: "Device disconnected successfully" })
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello! Please proceed to the /devices endpoint.');
});




