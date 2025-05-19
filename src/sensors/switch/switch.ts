import { Subscriber } from '../../subscriber';
import { BinarySensor } from '../binary-sensor/binary-sensor';
import { HaDiscoverableManager } from '../../settings';
import { SwitchInfo } from './switch-info';

/**
 * Implements an MQTT switch for Home Assistant discovery
 */
export class Switch
  extends Subscriber<SwitchInfo, 'ON' | 'OFF'>
  implements Pick<BinarySensor, Exclude<keyof BinarySensor, 'entity' | keyof Subscriber<never>>>
{
  constructor(entity: SwitchInfo, settings: HaDiscoverableManager) {
    super(entity, settings);
  }

  switchOff() {
    return BinarySensor.prototype.switchOff.call(this);
  }

  switchOn() {
    return BinarySensor.prototype.switchOn.call(this);
  }

  updateState(state: boolean) {
    return BinarySensor.prototype.updateState.call(this, state);
  }
}
