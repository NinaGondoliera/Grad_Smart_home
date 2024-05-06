const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

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

  await dynamoDB.updateItem(light_params).promise();

  return {
    statusCode: 200,
    body: 'Light updated successfully'
  };
};

