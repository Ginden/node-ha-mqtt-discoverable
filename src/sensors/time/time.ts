import { Subscriber } from '../../subscriber';
import { TimeInfo } from './time-info';
import { HaDiscoverableManager } from '../../settings';

const timePattern = /^(\d{2}):(\d{2}):(\d{2})$/;

/**
 * Implements an MQTT time for Home Assistant discovery
 */
export class Time extends Subscriber<TimeInfo> {
  constructor(entityInfo: TimeInfo, settings: HaDiscoverableManager) {
    super(entityInfo, settings);
    this.parseJson = false;
  }

  /** Update the time state. The value must be formatted as HH:mm:ss. */
  setTime(time: string) {
    if (!isValidTime(time)) {
      throw new Error('Time must be a valid time formatted as HH:mm:ss');
    }
    return this._state_helper(time);
  }
}

function isValidTime(value: string): boolean {
  const match = timePattern.exec(value);
  if (!match) {
    return false;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = Number(match[3]);

  return hour <= 23 && minute <= 59 && second <= 59;
}
