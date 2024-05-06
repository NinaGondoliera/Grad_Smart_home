var AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

var database = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

var params = {
  TableName: "Devices",
  Item: {
    name: { S: "Motion Tracker" },
    state: { S: "Off" }
  },
};

database.putItem(params, function (err, data) {
  if (err) {
    console.log("Cannot add device", err);
  } else {
    console.log("Device connected successfully!", data);
  }
});