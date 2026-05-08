import { EventEmitter } from 'events';
import { expect, suite, test, vi } from 'vitest';
import { MqttDate } from '../date/mqtt-date';
import { DateInfo } from '../date/date-info';
import { DateTime } from './date-time';
import { DateTimeInfo } from './date-time-info';
import { HaDiscoverableManager } from '../../settings/ha-discoverables-manager';
import { Time } from '../time/time';
import { TimeInfo } from '../time/time-info';

class FakeMqttClient extends EventEmitter {
  connected = false;
  publishAsync = vi.fn(async () => undefined);
  subscribeAsync = vi.fn(async () => []);
}

suite('MQTT date/time entities', () => {
  test('date discovery config contains command topic and templates', async () => {
    const client = new FakeMqttClient();
    const manager = new HaDiscoverableManager(client as never);
    const entity = DateInfo.create({
      name: 'Scheduled Date',
      commandTemplate: '{{ value }}',
      retain: true,
    });

    const date = new MqttDate(entity, manager);
    await date.register();

    expect(client.publishAsync).toHaveBeenCalledWith(
      'homeassistant/date/Scheduled-Date/config',
      JSON.stringify({
        name: 'Scheduled Date',
        component: 'date',
        command_template: '{{ value }}',
        retain: true,
        state_topic: 'hmd/date/Scheduled-Date/state',
        json_attributes_topic: 'hmd/date/Scheduled-Date/attributes',
        command_topic: 'hmd/date/Scheduled-Date/state/command',
      }),
      { retain: true, properties: { messageExpiryInterval: 2419200 } },
    );
  });

  test('datetime discovery config includes timezone', async () => {
    const client = new FakeMqttClient();
    const manager = new HaDiscoverableManager(client as never);
    const entity = DateTimeInfo.create({
      name: 'Scheduled DateTime',
      timezone: 'Europe/Warsaw',
    });

    const dateTime = new DateTime(entity, manager);
    await dateTime.register();

    expect(client.publishAsync).toHaveBeenCalledWith(
      'homeassistant/datetime/Scheduled-DateTime/config',
      JSON.stringify({
        name: 'Scheduled DateTime',
        component: 'datetime',
        timezone: 'Europe/Warsaw',
        state_topic: 'hmd/datetime/Scheduled-DateTime/state',
        json_attributes_topic: 'hmd/datetime/Scheduled-DateTime/attributes',
        command_topic: 'hmd/datetime/Scheduled-DateTime/state/command',
      }),
      { retain: true, properties: { messageExpiryInterval: 2419200 } },
    );
  });

  test('date and time helpers publish validated strings', async () => {
    const client = new FakeMqttClient();
    const manager = new HaDiscoverableManager(client as never);

    const date = new MqttDate(DateInfo.create({ name: 'Date' }), manager);
    const time = new Time(TimeInfo.create({ name: 'Time' }), manager);

    await date.setDate('2026-05-08');
    await time.setTime('14:15:16');

    expect(client.publishAsync).toHaveBeenCalledWith('hmd/date/Date/state', '2026-05-08', {
      retain: true,
    });
    expect(client.publishAsync).toHaveBeenCalledWith('hmd/time/Time/state', '14:15:16', {
      retain: true,
    });
  });

  test('date and time helpers reject malformed strings', () => {
    const client = new FakeMqttClient();
    const manager = new HaDiscoverableManager(client as never);
    const date = new MqttDate(DateInfo.create({ name: 'Date' }), manager);
    const time = new Time(TimeInfo.create({ name: 'Time' }), manager);

    expect(() => date.setDate('2026-5-8')).toThrow(
      'Date must be a valid date formatted as YYYY-MM-DD',
    );
    expect(() => date.setDate('2026-02-29')).toThrow(
      'Date must be a valid date formatted as YYYY-MM-DD',
    );
    expect(() => time.setTime('4:15:16')).toThrow(
      'Time must be a valid time formatted as HH:mm:ss',
    );
    expect(() => time.setTime('24:00:00')).toThrow(
      'Time must be a valid time formatted as HH:mm:ss',
    );
  });
});
