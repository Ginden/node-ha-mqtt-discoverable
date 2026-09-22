import { expect, test, vi } from 'vitest';
import { setImmediate } from 'timers/promises';
import { Update, UpdateInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('publishes version metadata and receives install requests', async () => {
  const { client, manager } = mqttTestContext();
  const update = new Update(
    UpdateInfo.create({
      name: 'Firmware',
      latestVersionTopic: 'firmware/latest',
      payloadInstall: 'upgrade',
    }),
    manager,
  );
  await update.updateState({
    installed_version: '1.0',
    latest_version: '2.0',
    in_progress: true,
    update_percentage: 25,
  });
  await update.setLatestVersion('2.1');
  expect(client.publishAsync).toHaveBeenCalledWith(
    'hmd/update/Firmware/state',
    '{"installed_version":"1.0","latest_version":"2.0","in_progress":true,"update_percentage":25}',
    { retain: true },
  );
  expect(client.publishAsync).toHaveBeenLastCalledWith('firmware/latest', '2.1', { retain: true });
  const handler = vi.fn();
  update.on('command.string', handler);
  await update.subscribe();
  client.emit('message', update.commandTopic, Buffer.from('upgrade'), {});
  await setImmediate();
  expect(handler).toHaveBeenCalledWith('upgrade', update, update.commandTopic, expect.any(Object));
});
