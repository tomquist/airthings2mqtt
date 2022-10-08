# airthings2mqtt

CLI tool to poll the Airthings Consumer API for the latest sample data of all devices and publishes them to an MQTT broker.

## Locally
```bash
npm install && npm run build
A2M_CLIENT_ID=*** \
  A2M_CLIENT_SECRET=*** \
  A2M_MQTT_URI=mqtt://localhost:1883 \
  npm run start
```

## Docker
```bash
docker run -d \
  -e A2M_CLIENT_ID=*** \
  -e A2M_CLIENT_SECRET=*** \
  -e A2M_MQTT_URI=mqtt://localhost:1883
  tomquist/airthings2mqtt:latest
```

## Configuration
The app can be configured using these environment variables:

- `A2M_CLIENT_ID` (required): A Airthings Consumer API client id
- `A2M_CLIENT_SECRET` (required): The client secret
- `A2M_SCOPES` (optional): Can be used to customize the scopes using a comma-separated list. Default `read:device:current_values` 
- `A2M_POLL_INTERVAL` (optional): The polling interval in seconds (Default `60`) 
- `A2M_MQTT_URI` (required): // The MQTT broker URL, e.g. `mqtt://host:1883`
- `A2M_MQTT_USERNAME` (optional): // Optional username for MQTT authentication
- `A2M_MQTT_PASSWORD` (optional): // Optional password for MQTT authentication
- `A2M_MQTT_CLIENT_ID` (optional): // MQTT client identifier. Default: `airthings2mqtt`
- `A2M_MQTT_TOPIC` (required): // Topic prefix where data should be published. Default: `airthings`
- `A2M_VERBOSE` (optional): // Set to `true` for more logs. Default: `false'