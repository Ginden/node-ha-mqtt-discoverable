import { expect, test, vi } from 'vitest';
import { setImmediate } from 'timers/promises';
import { Notify, NotifyInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('discovers a command-only notify and delivers commands as strings', async () => {
  const { client, manager } = mqttTestContext();
  const entity = new Notify(
    NotifyInfo.create({
      name: 'Action',
      commandTopic: 'action/notify',
      commandTemplate: '{{ message }}',
    }),
    manager,
  );
  await entity.register();
  await entity.subscribe();
  expect(entity.generateConfig()).not.toHaveProperty('state_topic');
  const handler = vi.fn();
  entity.on('command.string', handler);
  client.emit('message', 'action/notify', Buffer.from('Hello there'), {});
  await setImmediate();
  expect(handler).toHaveBeenCalledWith('Hello there', entity, 'action/notify', expect.any(Object));
});
