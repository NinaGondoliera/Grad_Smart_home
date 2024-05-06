var AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-2" });

var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

var smart_events = new AWS.EventBridge({ apiVersion: "2015-10-07" });

var device_name = "Motion Tracker";
var new_state = "Triggered";

var params = {
  TableName: "Devices",
  Key: {
    name: device_name,
  },
  UpdateExpression: "set #s = :s", 
  ExpressionAttributeNames: {
    "#s": "state", 
  },
  ExpressionAttributeValues: {
    ":s": new_state,
  },
};

docClient.update(params, function (err, data) {
  if (err) {
    console.log("Error updating item:", err);
  } else {
    console.log("Item updated successfully:", data);
      
    const dynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    
    const tableName = 'Devices';
    
    const db_params = {
      TableName: tableName,
    };
    
    dynamoDB.describeTable(db_params, function(err, data) {
      if (err) {
        console.error('Error describing table:', err);
      } else {
        const tableArn = data.Table.TableArn;
        console.log('DynamoDB table ARN:', tableArn);

        var event_detail = {
            name: device_name,
            state: new_state
        }

        var event_params = {
           Entries: [
          {
            Detail: JSON.stringify(event_detail),
            DetailType: "motionTriggered",
            Resources: [tableArn],
            Source: "smart_home_server"
          },
        ],
      };
    
      smart_events.putEvents(event_params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.Entries);
        }
      });
    
      }
    });
  }
});


