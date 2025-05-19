import { Discoverable } from '../../discoverable';
import { BinarySensorInfo } from './binary-sensor-info';
import { SwitchInfo } from '../switch/switch-info';
import { HaDiscoverableManager } from '../../settings';

/**
 * Implements an MQTT binary sensor for Home Assistant discovery
 */
export class BinarySensor extends Discoverable<BinarySensorInfo | SwitchInfo> {
  static [Symbol.hasInstance](val: unknown): val is BinarySensor {
    if (!val) {
      return false;
    }
    if (val.constructor === BinarySensor) {
      return true;
    }
    return (
      val instanceof Discoverable &&
      'switchOff' in val &&
      'switchOff' in val &&
      'updateState' in val &&
      typeof val['switchOff'] === 'function' &&
      typeof val['switchOff'] === 'function' &&
      typeof val['updateState'] === 'function'
    );
  }

  public readonly entity: BinarySensorInfo;

  constructor(entity: BinarySensorInfo, globalSettings: HaDiscoverableManager) {
    super(globalSettings, entity);
    this.entity = entity;
  }

  /**
   * Set binary sensor to off
   * **/
  switchOff(this: Pick<BinarySensor, 'updateState'>) {
    return this.updateState(false);
  }

  /**
   * Set binary sensor to on
   * **/
  switchOn(this: Pick<BinarySensor, 'updateState'>) {
    return this.updateState(true);
  }

  /** Update MQTT sensor state */
  updateState(state: boolean) {
    return this._state_helper(state ? this.entity.payloadOn : this.entity.payloadOff);
  }
}
