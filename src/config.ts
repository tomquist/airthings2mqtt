import { config as configDotenv } from "dotenv";

function stringEnvVar(envVarName: keyof typeof process["env"]): string;

function stringEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue: string
): string;

function stringEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue: null
): string | undefined;
function stringEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue?: string | null,
): string | undefined {
  const value = process.env[envVarName];
  if (value == null && defaultValue === undefined) {
    console.error(`Missing env var ${envVarName}`);
    process.exit(1);
  }
  return value ?? defaultValue ?? undefined;
}
function intEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue?: number,
): number {
  if (defaultValue != null) {
    const value = stringEnvVar(envVarName, null);
    if (value == null) {
      return defaultValue;
    }
    return parseInt(value, 10);
  } else {
    const value = stringEnvVar(envVarName);
    return parseInt(value, 10);
  }
}
function boolEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue = false,
): boolean {
  const value = stringEnvVar(envVarName, null);
  if (value == null) {
    return defaultValue;
  }
  return value === "true";
}

function arrayEnvVar(
  envVarName: keyof typeof process["env"],
  defaultValue?: string[],
): string[] {
  if (defaultValue != null) {
    const value = stringEnvVar(envVarName, null);
    if (value == null) {
      return defaultValue;
    }
    return value.split(",");
  } else {
    const value = stringEnvVar(envVarName);
    return value.split(",");
  }
}
export function getConfig() {
  configDotenv();
  return {
    clientId: stringEnvVar("A2M_CLIENT_ID"),
    clientSecret: stringEnvVar("A2M_CLIENT_SECRET"),
    scopes: arrayEnvVar("A2M_SCOPES", ["read:device:current_values"]),
    pollInterval: intEnvVar("A2M_POLL_INTERVAL", 60),
    mqttUrl: stringEnvVar("A2M_MQTT_URI"),
    mqttClientId: stringEnvVar("A2M_MQTT_CLIENT_ID", "airthings2mqtt"),
    mqttUsername: stringEnvVar("A2M_MQTT_USERNAME", null),
    mqttPassword: stringEnvVar("A2M_MQTT_PASSWORD", null),
    mqttRetain: boolEnvVar("A2M_MQTT_RETAIN"),
    mqttTopic: stringEnvVar("A2M_MQTT_TOPIC", "airthings"),
    verbose: boolEnvVar("A2M_VERBOSE", false),
  };
}

export function anonymizeConfig(
  config: ReturnType<typeof getConfig>,
): ReturnType<typeof getConfig> {
  const newConfig = { ...config };
  const hideKeys: Array<keyof ReturnType<typeof getConfig>> = [
    "mqttPassword",
    "clientSecret",
  ];
  for (const key of hideKeys) {
    if (config[key] != null) {
      (newConfig as any)[key] = "***";
    }
  }
  return newConfig;
}
