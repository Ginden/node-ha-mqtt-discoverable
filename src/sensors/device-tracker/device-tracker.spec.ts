import { expect, test } from 'vitest';
import { DeviceTracker, DeviceTrackerInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('reports presence and GPS attributes on configured topics', async () => {
  const { client, manager } = mqttTestContext();
  const tracker = new DeviceTracker(
    DeviceTrackerInfo.create({
      name: 'Phone',
      stateTopic: 'phone/presence',
      jsonAttributesTopic: 'phone/gps',
      sourceType: 'gps',
      payloadHome: 'present',
    }),
    manager,
  );
  await tracker.home();
  await tracker.setLocation(52.2, 21, 5);
  expect(client.publishAsync).toHaveBeenCalledWith('phone/presence', 'present', { retain: true });
  expect(client.publishAsync).toHaveBeenLastCalledWith(
    'phone/gps',
    JSON.stringify({ latitude: 52.2, longitude: 21, gps_accuracy: 5 }),
    { retain: true },
  );
  expect(tracker.generateConfig()).toMatchObject({
    source_type: 'gps',
    state_topic: 'phone/presence',
    json_attributes_topic: 'phone/gps',
  });
  expect(tracker.generateConfig()).not.toHaveProperty('command_topic');
  await tracker.unregister();
  expect(client.publishAsync).toHaveBeenCalledWith('phone/presence', '', { retain: true });
});
