import { AirthingsApi } from "./api";
import { anonymizeConfig, getConfig } from "./config";
import { consoleLogger } from "./logger";
import { sleep } from "./utils";
import { Device } from "./models";
import { Publisher } from "./publish";

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

  const publisher = new Publisher(config.mqttUrl, config.mqttRetain, config.mqttClientId.length > 0 ? config.mqttClientId : undefined, config.mqttUsername, config.mqttPassword);
  async function fetchAndPublish(
    device: Device,
  ): Promise<void> {
    logger.log(
      `Fetching data for device ${device.id}`,
    );
    const data = await api.getLatestSamples(device.id);
    logger.log(`Fetched ${Object.keys(data.data).length} data-points`);
    const topic = `${config.mqttTopic}/${device.id}`;
    const message = {
      data: data.data,
      info: device,
      timestamp: new Date().toISOString(),
    };
    await publisher.publish(topic, message);
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
