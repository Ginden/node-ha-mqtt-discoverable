import { expect, test, vi } from 'vitest';
import { setImmediate } from 'timers/promises';
import { Scene, SceneInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('discovers a command-only scene and delivers commands as strings', async () => {
  const { client, manager } = mqttTestContext();
  const entity = new Scene(
    SceneInfo.create({ name: 'Action', commandTopic: 'action/scene', payloadOn: 'ACTIVATE' }),
    manager,
  );
  await entity.register();
  await entity.subscribe();
  expect(entity.generateConfig()).not.toHaveProperty('state_topic');
  const handler = vi.fn();
  entity.on('command.string', handler);
  client.emit('message', 'action/scene', Buffer.from('ACTIVATE'), {});
  await setImmediate();
  expect(handler).toHaveBeenCalledWith('ACTIVATE', entity, 'action/scene', expect.any(Object));
});
