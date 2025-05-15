import { Subscriber } from '../../subscriber';
import { BinarySensor } from '../binary-sensor/binary-sensor';
import { HaDiscoverableManager, MessageCallback } from '../../settings';
import { SwitchInfo } from './switch-info';

/**
 * Implements an MQTT switch for Home Assistant discovery
 */
export class Switch
  extends Subscriber<SwitchInfo>
  implements Pick<BinarySensor, Exclude<keyof BinarySensor, 'entity'>>
{
  constructor(
    entity: SwitchInfo,
    settings: HaDiscoverableManager,
    command: MessageCallback<'on' | 'off'>,
  ) {
    super(entity, settings, command as MessageCallback);
  }

  off() {
    return BinarySensor.prototype.off.call(this);
  }

  on() {
    return BinarySensor.prototype.on.call(this);
  }

  updateState(state: boolean) {
    return BinarySensor.prototype.updateState.call(this, state);
  }
}
