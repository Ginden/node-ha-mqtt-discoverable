import { Subscriber } from '../../subscriber';
import { ButtonInfo } from './button-info';
import { HaDiscoverableManager } from '../../settings';

/**
 * Implements an MQTT button for Home Assistant discovery
 */
export class Button extends Subscriber<ButtonInfo, 'PRESS'> {
  constructor(entityInfo: ButtonInfo, settings: HaDiscoverableManager) {
    super(entityInfo, settings);
  }
}
