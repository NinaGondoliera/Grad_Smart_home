## Instructions on using the smart_home_server ##

### This is an infrastructure involving an HTTP server, an AWS DynamoDB database to store connected devices, an AWS EventBridge eventbus to serve as the router for actions based on device behaviour and AWS Lambda for invoking device behaviour.
### The server allows users to connect new devices through the connect_device.js. When executed, it connects two external components to the system - a Motion Tracker and a Light, both initially set to "Off". When the Motion Tracker is triggered by movement, the Light is turned "On" (Functionality not working currently). 

### Device_config.js allows for switching the devices to "On", "Off", or "Triggered". Any device can be disconnected by submitting a DELETE request to the /devices/Device_name endpoint. 

### For accessing different endpoints it is advised to use Insomnia or Postman to allow for CRUD methods

### GET request to the /devices endpoint displays all connected devices and their current state

## 1. First make sure you are authenticated with aws, use 
``` aws sts get-caller-identity```

## to check. 
If you are not authenticated, use 
``` aws configure``` 

and provide your login credentials, please keep the region "eu-west-2". 

## 2. Navigate to the terraform directory and run 

``` terraform init ``` 

followed by 

``` terraform apply``` 

Type "yes" when prompted to create the necessary infrastructure. 

## 3. Navigate to the root level of the project and run ## 

``` npm init``` 


``` npm install express``` 


``` npm install aws-sdk``` 

## 4. To start the server, run 

``` npm start ```

## 5. To connect external components to the infrastructure, namely a Motion Tracker (The event publisher) and a Light (event consumer), run 

```node connect_device.js``` 

 This connects two external components to the infrastructure, with their state turned to "Off" by default. 

## 6. To alter the state of a device, go to device_config.js, change the device_name and new_state variables accordingly, then run 

```node device_config.js``` 

 Any and all of these changes can be tracked either via the Managment Console, in DynamoDB Table "Devices" and "Explore items"; Or by going to the /devices endpoint, which will display all of the devices currently connected.

## 7. To disconnect a device 
use a REST client tool like Insomnia or Postman to issue a DELETE request to the following endpoint : http://localhost:3000/devices/DEVICE_NAME, 
for example "localhost:3000/devices/Light" will disconnect the Light from the infrastructure. 


## 8. Containerisation

 The server can also run in a docker container locally, to do so please make sure the Docker desktop is initiated and you are authenticated. Navigate to the root level of the project directory and run 

``` docker build -t smart_home_server```

 When the image is created, run 

``` docker build -p 3000:3000 smart_home_server```

This will start the server running in a container and the endpoints will be accessible in the same way as mentioned above. 

###

## Notes on futher works ## 

### Currently the trigger between the Motion Tracker and the Light is not functioning as intended, but the functionality of separate elements can be tracked via AWS Monitoring for EventBridge, Lambda and DynamoDB separately in the Management Console. 

### The Lambda function successfully updates the Light device to "On", when triggered in the following test event in the management console : 

{
  "source": "smart_home_server",
  "detail-type": "motionTriggered",
  "detail": {
    "name": "Motion Tracker",
    "state": "Triggered"
  }
}

### The EventBridge has a successful event posted when the Motion Tracker state is changed to "Triggered" in device_config.js.