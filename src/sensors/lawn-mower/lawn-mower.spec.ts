import { expect, test } from 'vitest';
import { LawnMower, LawnMowerInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('uses the activity schema and routes start, pause, dock and stop commands', async () => {
  const { client, manager } = mqttTestContext();
  const mower = new LawnMower(
    LawnMowerInfo.create({
      name: 'Garden',
      activityStateTopic: 'garden/activity',
      stopCommandTopic: 'garden/stop',
      startMowingCommandTemplate: 'start',
    }),
    manager,
  );
  await mower.setActivity('mowing');
  await mower.subscribe();
  expect(client.publishAsync).toHaveBeenLastCalledWith('garden/activity', 'mowing', {
    retain: true,
  });
  const config = mower.generateConfig();
  expect(config).not.toHaveProperty('state_topic');
  expect(config).not.toHaveProperty('command_topic');
  expect(config).toMatchObject({ start_mowing_command_template: 'start' });
  for (const topic of [
    'hmd/lawn_mower/Garden/state/start/command',
    'hmd/lawn_mower/Garden/state/pause/command',
    'hmd/lawn_mower/Garden/state/dock/command',
    'garden/stop',
  ]) {
    expect(client.subscribeAsync).toHaveBeenCalledWith(topic, { qos: 1 });
  }
});
