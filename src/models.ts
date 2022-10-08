export type Sensor = "radonShortTermAvg" | "radonLongTermAvg" | "temp" | "outdoorTemp" | "humidity" | "outdoorHumidity" | "co2" | "voc" | "pressure" | "outdoorPressure" | "pressureDifference" | "pressureDiffStdDev" | "pressureDiffMin" | "pressureDiffMax" | "light" | "lux" | "batteryPercentage" | "batteryVoltage" | "orientation" | "pm1" | "outdoorPm1" | "pm25" | "outdoorPm25" | "pm10" | "outdoorPm10" | "mold" | "staleAir" | "transmissionEfficiency" | "virusSurvivalRate" | "virusRisk" | "windSpeed" | "windDirection" | "windGust" | "dewPoint" | "cloudCover" | "visibility" | "precipitation_probability" | "total_precipitation" | "outdoorWeather" | "hourlyRadonStandardDeviation" | "hourlyRadon" | "energyWastage" | "energyScenarios" | "historicVentilationConfidence" | "daytimeBaseline" | "daytimePeak" | "nightBaseline" | "historicVentilation" | "ventilationRunningConfidence" | "occupantsUpper" | "occupantsLower" | "occupants" | "relativeOccupants" | "ventilationAmount" | "historicVentilationRunning" | "ventilationRunning" | "relativeVentilationRate" | "aggregated" | "sla" | "pressureAtMinHeight" | "pressureAtMaxHeight" | "regulationPressure" | "regulationHeight" | "zeroPressureHeight" | "totalPowerLost" | "moistGuard" | "potentialPowerSaved" | "potentialPowerSavedPercent" | "zeroHeightPercent" | "zone" | "controlSignal" | "controlStatus" | "returnState" | "appliedGain" | "lastBestControlSignal" | "lastBestSignalError" | "lastBestControlSignalGain" | "lastBestControlSignalRecorded" | "messages" | "balanceControl" | "controlSignalSlot01" | "controlSignalSlot02" | "controlSignalSlot03" | "controlSignalSlot04" | "controlSignalSlot05" | "controlSignalSlot06" | "controlSignalSlot07" | "controlSignalSlot08" | "inletAirControl" | "powerVoltage" | "rsrp" | "ventController" | "subsamplesCount" | "subsamples" | "balanceInfo" | "outdoorNo2" | "outdoorO3" | "outdoorSo2" | "outdoorCo" | "outdoorNo" | "airly" | "airlyNo2" | "airlyCo" | "airlyNo" | "bacnet";
export type DeviceType = "WAVE" | "WAVE_MIST" | "WAVE_GEN2" | "WAVE_MINI" | "WAVE_PLUS" | "WAVE_CO2" | "VIEW_PLUS" | "VIEW_PLUS_BUSINESS" | "VIEW_POLLUTION" | "VIEW_RADON" | "VIEW_CO2" | "SPACE_CO2_MINI" | "WAVE_ENHANCE" | "HUB" | "HOME" | "PRO" | "CLOUDBERRY" | "AIRTIGHT" | "AGGREGATED_GROUP" | "ZONE_GROUP" | "BALANCE_CONTROL" | "INLET_AIR_CONTROL" | "VENT_CONTROLLER" | "AIRLY" | "AIRLY_NO2" | "AIRLY_CO" | "AIRLY_NO" | "BREEZOMETER_WEATHER" | "BACNET" | "UNKNOWN";

export interface Segment {
  id: string;
  name: string;
  started: string;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
}

export interface Device {
  id: string;
  deviceType: DeviceType;
  sensors: Sensor[];
  segment: Segment;
  location: Location;
}

export interface DevicesResponse {
  devices: Device[];
}

export interface SampleData {
  battery:number;
  co2: number;
  humidity: number;
  light	: number;
  lux: number;
  mold: number;
  pm1: number;
  pm10: number;
  pm25: number;
  pressure: number;
  pressureDifference: number;
  radonShortTermAvg: number;
  rssi: number;
  sla: number;
  temp: number;
  time: number;
  virusRisk: number;
  voc: number;
  outdoorTemp: number;
  outdoorHumidity: number;
  outdoorPressure: number;
  outdoorPm10: number;
  outdoorPm1: number;
  outdoorPm25: number;
  outdoorNo2: number;
  outdoorO3: number;
  outdoorSo2: number;
  outdoorCo: number;
  outdoorNo: number;
  controlSignal: number;
  controlSignalSlot01: number;
  controlSignalSlot02: number;
  controlSignalSlot03: number;
  controlSignalSlot04: number;
  controlSignalSlot05: number;
  controlSignalSlot06: number;
  controlSignalSlot07: number;
  controlSignalSlot08: number;
  regulationPressure: number;
  regulationHeight: number;
  relayDeviceType: string;
}

export interface SampleDataResponse {
  data: SampleData;
}