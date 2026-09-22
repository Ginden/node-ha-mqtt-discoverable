import { expect, test } from 'vitest';
import { Valve, ValveInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('publishes native positions including reversed ranges and rejects conflicting payloads', async () => {
  const { client, manager } = mqttTestContext();
  const valve = new Valve(
    ValveInfo.create({
      name: 'Water',
      reportsPosition: true,
      positionClosed: 255,
      positionOpen: 0,
    }),
    manager,
  );
  await valve.setPosition(128);
  await valve.updateState('closed');
  expect(client.publishAsync).toHaveBeenCalledWith('hmd/valve/Water/state', '128', {
    retain: true,
  });
  expect(client.publishAsync).toHaveBeenLastCalledWith('hmd/valve/Water/state', '255', {
    retain: true,
  });
  expect(() => valve.setPosition(256)).toThrow(RangeError);
  expect(() =>
    ValveInfo.create({ name: 'Invalid', reportsPosition: true, payloadOpen: 'OPEN' }),
  ).toThrow('Position-reporting valves');
});
