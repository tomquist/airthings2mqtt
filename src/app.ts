import MQTT from "async-mqtt";
import { AirthingsApi } from "./api";
import { anonymizeConfig, getConfig } from "./config";
import { consoleLogger } from "./logger";
import { sleep } from "./utils";
import { Device } from "./models";

const config = getConfig();
const logger = consoleLogger(config.verbose);

async function run(): Promise<void> {
  logger.log(JSON.stringify(anonymizeConfig(config)));
  const api = new AirthingsApi({
    auth: {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      scopes: config.scopes,
    },
    logger,
  });
  logger.log("Getting devices...");
  const devices = await api.getDevices();

  async function publish(topic: string, message: any) {
    const mqttClient = await MQTT.connectAsync(config.mqttUrl, {
      clientId:
        config.mqttClientId.length > 0 ? config.mqttClientId : undefined,
      username: config.mqttUsername,
      password: config.mqttPassword,
    });
    await mqttClient.publish(topic, JSON.stringify(message), { retain: config.mqttRetain });
    await mqttClient.end();
  }

  async function fetchAndPublish(
    device: Device,
  ): Promise<void> {
    logger.log(
      `Fetching data for device ${device.id}`,
    );
    const data = await api.getLatestSamples(device.id);
    logger.log(`Fetched ${Object.keys(data.data).length} data-points`);
    const mqttClient = await MQTT.connectAsync(config.mqttUrl, {
      clientId:
        config.mqttClientId.length > 0 ? config.mqttClientId : undefined,
      username: config.mqttUsername,
      password: config.mqttPassword,
    });
    const topic = `${config.mqttTopic}/${device.id}`;
    const message = {
      data: data.data,
      info: device,
      timestamp: new Date().toISOString(),
    };
    await publish(topic, message);
    logger.log("Published.");
  }

  for (;;) {
    const start = new Date().getTime();
    for (const device of devices.devices) {
      try {
        await fetchAndPublish(device);
      } catch (e) {
        logger.warn("Failed fetching or publishing device data", e);
      }
    }
    const end = new Date().getTime() - start;
    const sleepInterval = config.pollInterval * 1000 - end;
    logger.log(`Sleeping for ${sleepInterval}ms...`);
    await sleep(sleepInterval);
  }
}

run()
  .then(() => {
    logger.log("Done");
  })
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
