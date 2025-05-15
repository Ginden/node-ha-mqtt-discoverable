import { Discoverable } from '../../discoverable';
import { SensorInfo } from './sensor-info';

/**
 * Implements an MQTT sensor for Home Assistant discovery
 */
export class Sensor extends Discoverable<SensorInfo> {
  /**
   * Update MQTT sensor state
   * @param state State value to set (string or numeric)
   */
  updateState(state: string | number) {
    return this._state_helper(state);
  }
}
