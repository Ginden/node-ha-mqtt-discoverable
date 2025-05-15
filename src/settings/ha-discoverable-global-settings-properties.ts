import type { MqttClient } from 'mqtt';

import type { HaDiscoverableMqttSettings } from './ha-discoverable-mqtt-settings';
import type { DiscoverableLogger } from './discoverable-logger';

export interface HaDiscoverableGlobalSettingsProperties {
  // id: symbol;
  client: MqttClient;
  mqttSettings?: HaDiscoverableMqttSettings;
  manualAvailability?: boolean;
  logger?: DiscoverableLogger;
}
