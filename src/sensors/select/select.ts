import { Subscriber } from '../../subscriber';
import { SelectInfo } from './select-info';

/**
 * Implements an MQTT select for Home Assistant discovery
 */
export class Select extends Subscriber<SelectInfo> {
  /** Update the selectable options */
  setOptions(options: NonNullable<SelectInfo['options']>) {
    // FIXME: we are porting bugs now
    return this._state_helper(options as never);
  }
}
