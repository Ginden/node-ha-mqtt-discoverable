import { Subscriber } from '../../subscriber';
import { DateInfo } from './date-info';
import { HaDiscoverableManager } from '../../settings';

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Implements an MQTT date for Home Assistant discovery
 */
export class MqttDate extends Subscriber<DateInfo> {
  constructor(entityInfo: DateInfo, settings: HaDiscoverableManager) {
    super(entityInfo, settings);
    this.parseJson = false;
  }

  /** Update the date state. The value must be formatted as YYYY-MM-DD. */
  setDate(date: string) {
    if (!isValidDate(date)) {
      throw new Error('Date must be a valid date formatted as YYYY-MM-DD');
    }
    return this._state_helper(date);
  }
}

function isValidDate(value: string): boolean {
  const match = datePattern.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12) {
    return false;
  }

  const maxDays = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= maxDays[month - 1];
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
