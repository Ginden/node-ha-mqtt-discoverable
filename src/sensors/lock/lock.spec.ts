import { expect, test, vi } from 'vitest';
import { setImmediate } from 'timers/promises';
import { Lock, LockInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('publishes configured lock states and receives unlock commands', async () => {
  const { client, manager } = mqttTestContext();
  const lock = new Lock(
    LockInfo.create({
      name: 'Door',
      stateLocked: 'secured',
      commandTopic: 'door/set',
      payloadUnlock: 'release',
    }),
    manager,
  );
  await lock.locked();
  expect(client.publishAsync).toHaveBeenLastCalledWith('hmd/lock/Door/state', 'secured', {
    retain: true,
  });
  await lock.subscribe();
  const handler = vi.fn();
  lock.on('command.string', handler);
  client.emit('message', 'door/set', Buffer.from('release'), {});
  await setImmediate();
  expect(handler).toHaveBeenCalledWith('release', lock, 'door/set', expect.any(Object));
});
