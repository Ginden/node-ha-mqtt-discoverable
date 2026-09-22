import { expect, test } from 'vitest';
import { Vacuum, VacuumInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('publishes JSON state and subscribes to fan speed and custom command channels', async () => {
  const { client, manager } = mqttTestContext();
  const vacuum = new Vacuum(
    VacuumInfo.create({
      name: 'Cleaner',
      sendCommandTopic: 'cleaner/custom',
      setFanSpeedTopic: 'cleaner/fan',
      fanSpeedList: ['quiet', 'turbo'],
    }),
    manager,
  );
  await vacuum.updateState({ state: 'cleaning', fan_speed: 'quiet', battery_level: 80 });
  expect(client.publishAsync).toHaveBeenLastCalledWith(
    'hmd/vacuum/Cleaner/state',
    '{"state":"cleaning","fan_speed":"quiet","battery_level":80}',
    { retain: true },
  );
  await vacuum.subscribe();
  expect(client.subscribeAsync).toHaveBeenCalledWith('cleaner/fan', { qos: 1 });
  expect(client.subscribeAsync).toHaveBeenCalledWith('cleaner/custom', { qos: 1 });
  expect(vacuum.generateConfig()).toMatchObject({
    schema: 'state',
    fan_speed_list: ['quiet', 'turbo'],
  });
});
