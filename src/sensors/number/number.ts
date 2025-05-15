import { Subscriber } from '../../subscriber';
import { NumberInfo } from './number-info';

/**
 * Implements an MQTT number for Home Assistant discovery
 */
export class Number extends Subscriber<NumberInfo> {
  /** Update the numeric value */
  setValue(value: number) {
    if (value < this.entity.min || value > this.entity.max) {
      const bound = `[${this.entity.min}, ${this.entity.max}]`;
      throw new Error(`Value is not within configured boundaries ${bound}`);
    }
    return this._state_helper(value);
  }
}
