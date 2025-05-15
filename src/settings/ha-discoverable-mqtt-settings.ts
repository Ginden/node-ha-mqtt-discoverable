export class HaDiscoverableMqttSettings {
  /**
   * The root of the topic tree where HA is listening for messages"
   */
  discoveryPrefix: string;
  /**
   * The root of the topic tree ha-mqtt-discovery publishes its state messages
   */
  statePrefix: string;

  constructor(statePrefix: string = 'hmd', discoveryPrefix: string = 'homeassistant') {
    this.statePrefix ??= statePrefix;
    this.discoveryPrefix ??= discoveryPrefix;
  }
}
