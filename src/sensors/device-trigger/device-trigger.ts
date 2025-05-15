import { Discoverable } from '../../discoverable';
import { DeviceTriggerInfo } from './device-trigger-info';

/**
 * Implements an MQTT Device Trigger for Home Assistant discovery
 */
export class DeviceTrigger extends Discoverable<DeviceTriggerInfo> {
  /**
   * Override to publish custom config for the device trigger
   */
  generateConfig() {
    /* TODO: original Python generate_config logic */
    return {
      ...super.generateConfig(),
      topic: this.stateTopic,
    };
  }

  /** Generate a device trigger event */
  trigger(payload: string | null = null): unknown {
    return this._state_helper(payload ?? null, undefined, undefined, false);
  }
}
