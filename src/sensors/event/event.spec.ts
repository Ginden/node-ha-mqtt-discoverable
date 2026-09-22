import { expect, test } from 'vitest';
import { MqttEvent, EventInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('reports event type and attributes without retaining or allowing an undeclared event', async () => {
  const { client, manager } = mqttTestContext();
  const event = new MqttEvent(
    EventInfo.create({ name: 'Doorbell', eventTypes: ['press'] }),
    manager,
  );
  await event.trigger('press', { event_type: 'spoof', count: 2 });
  expect(client.publishAsync).toHaveBeenLastCalledWith(
    'hmd/event/Doorbell/state',
    '{"event_type":"press","count":2}',
    { retain: false },
  );
  expect(event.generateConfig()).toMatchObject({ event_types: ['press'] });
  expect(() => event.trigger('hold')).toThrow(RangeError);
  expect(() => EventInfo.create({ name: 'Missing events' })).toThrow();
});
