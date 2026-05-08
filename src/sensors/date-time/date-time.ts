import { Subscriber } from '../../subscriber';
import { DateTimeInfo } from './date-time-info';
import { HaDiscoverableManager } from '../../settings';

/**
 * Implements an MQTT date/time for Home Assistant discovery
 */
export class DateTime extends Subscriber<DateTimeInfo> {
  constructor(entityInfo: DateTimeInfo, settings: HaDiscoverableManager) {
    super(entityInfo, settings);
    this.parseJson = false;
  }

  /** Update the date/time state. */
  setDateTime(dateTime: string) {
    return this._state_helper(dateTime);
  }
}
