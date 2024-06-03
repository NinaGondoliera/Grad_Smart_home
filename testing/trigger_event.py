import boto3
import json

client = boto3.client('events')

event_entry = {
    'Source': 'smart_home_server',
    'DetailType': 'motionTriggered',
    'Detail': json.dumps({'name': 'Motion Tracker', 'state': 'Triggered'}),
    'EventBusName': 'smart_events'
}

response = client.put_events(
    Entries=[
        event_entry
    ]
)

print(json.dumps(response, indent=2))
