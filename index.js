const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

AWS.config.update({ region: "eu-west-2" });

exports.handler = async (event) => {

const light_params = {
        TableName: "Devices",
        Key: {
            name: "Light",
        },
        UpdateExpression: "set #s = :s",
        ExpressionAttributeNames: {
            "#s": "state",
        },
        ExpressionAttributeValues: {
            ":s": "On",
        },
    };
  let data; 
  try {
    data = await docClient.update(light_params).promise();
    console.log("Function invoked with event:", event);
  } catch (err) {
  console.log(err);
  return err;
  }
  return data
};


// docClient.update(light_params, function (err, data) {
    //     if (err) {
    //       console.log("Cannot update item Light:", err);
    //     } else {
    //       console.log("Item Light updated to On successfully:", data);
    //     }
    //   })

    // try {
    //     const data = await docClient.update(light_params).promise();
    //     console.log("Light item updated to On:", data);
    //     return { statusCode: 200, body: "Light item updated to On" };
    // } catch (err) {
    //     console.error("Error updating Light item:", err);
    //     return { statusCode: 500, body: "Error updating Light item" };
    // }