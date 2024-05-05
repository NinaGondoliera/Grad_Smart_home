const express = require('express');
const router = express.Router();
var AWS = require('aws-sdk');

AWS.config.update({ region: "eu-west-2" });

var database = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

// Endpoint to retrieve devices
router.get('/', (req, res) => {
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
  
//Endpoint to disconnect device
router.delete('/:name', (req, res) => {
    console.log(req.params);
    var device_name = req.params.name;

    var params = {
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
      

})

module.exports = router;
