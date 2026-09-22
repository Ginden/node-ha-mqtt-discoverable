import { expect, test } from 'vitest';
import { Humidifier, HumidifierInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('publishes humidity and modes to independent topics and enforces the configured range', async () => {
  const { client, manager } = mqttTestContext();
  const humidifier = new Humidifier(
    HumidifierInfo.create({
      name: 'Room',
      minHumidity: 30,
      maxHumidity: 70,
      modes: ['eco'],
      modeCommandTopic: 'room/mode/set',
      modeStateTopic: 'room/mode',
    }),
    manager,
  );
  await humidifier.setTargetHumidity(45);
  await humidifier.setMode('eco');
  expect(client.publishAsync).toHaveBeenCalledWith('hmd/humidifier/Room/state/humidity', '45', {
    retain: true,
  });
  expect(client.publishAsync).toHaveBeenLastCalledWith('room/mode', 'eco', { retain: true });
  await humidifier.subscribe();
  expect(client.subscribeAsync).toHaveBeenCalledWith('room/mode/set', { qos: 1 });
  expect(client.subscribeAsync).toHaveBeenCalledWith('hmd/humidifier/Room/state/humidity/command', {
    qos: 1,
  });
  expect(() => humidifier.setTargetHumidity(80)).toThrow(RangeError);
  expect(() => humidifier.setMode('turbo')).toThrow(RangeError);
});
