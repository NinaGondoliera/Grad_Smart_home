var AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

var database = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

// Add Light device
var lightParams = {
  TableName: "Devices",
  Item: {
    name: { S: "Light" },
    state: { S: "Off" }
  },
};

database.putItem(lightParams, function (err, data) {
  if (err) {
    console.log("Cannot add Light device", err);
  } else {
    console.log("Light device connected successfully!", data);
  }
});

// Add Motion Tracker device
var motionParams = {
  TableName: "Devices",
  Item: {
    name: { S: "Motion Tracker" },
    state: { S: "Off" }
  },
};

database.putItem(motionParams, function (err, data) {
  if (err) {
    console.log("Cannot add Motion Tracker device", err);
  } else {
    console.log("Motion Tracker device connected successfully!", data);
  }
});
