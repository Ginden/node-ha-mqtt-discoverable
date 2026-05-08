export class HaDiscoverableMqttSettings {
  /**
   * The root of the topic tree where HA is listening for messages"
   */
  discoveryPrefix: string;
  /**
   * The root of the topic tree ha-mqtt-discovery publishes its state messages
   */
  statePrefix: string;
  /**
   * The topic on which Home Assistant publishes its birth message ("online") when it starts.
   * When received, all discovery configs are re-published.
   * Set to null to disable this behaviour.
   */
  haStatusTopic: string | null;
  /**
   * Message expiry interval in seconds for retained discovery config messages (MQTT v5).
   * Stale configs are automatically purged from the broker after this duration.
   * Set to null or Infinity to retain without expiry.
   * Default: 28 days.
   */
  configRetainExpirySeconds: number | null;

  constructor(
    statePrefix: string = 'hmd',
    discoveryPrefix: string = 'homeassistant',
    haStatusTopic: string | null = 'hass/status',
    configRetainExpirySeconds: number | null = 28 * 24 * 60 * 60,
  ) {
    this.statePrefix ??= statePrefix;
    this.discoveryPrefix ??= discoveryPrefix;
    this.haStatusTopic = haStatusTopic;
    this.configRetainExpirySeconds = configRetainExpirySeconds;
  }
}
