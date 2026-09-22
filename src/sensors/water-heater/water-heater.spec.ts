import { expect, test } from 'vitest';
import { WaterHeater, WaterHeaterInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('publishes water temperature and operation mode with independent power commands', async () => {
  const { client, manager } = mqttTestContext();
  const heater = new WaterHeater(
    WaterHeaterInfo.create({
      name: 'Tank',
      modes: ['off', 'eco'],
      powerCommandTopic: 'tank/power',
      temperatureCommandTopic: 'tank/set',
      temperatureUnit: 'C',
    }),
    manager,
  );
  await heater.setMode('eco');
  await heater.setTemperature(55);
  await heater.setCurrentTemperature(48);
  expect(client.publishAsync).toHaveBeenCalledWith('hmd/water_heater/Tank/state/mode', 'eco', {
    retain: true,
  });
  expect(client.publishAsync).toHaveBeenCalledWith(
    'hmd/water_heater/Tank/state/temperature',
    '55',
    { retain: true },
  );
  expect(client.publishAsync).toHaveBeenLastCalledWith(
    'hmd/water_heater/Tank/state/current-temperature',
    '48',
    { retain: true },
  );
  await heater.subscribe();
  expect(client.subscribeAsync).toHaveBeenCalledWith('tank/power', { qos: 1 });
  expect(client.subscribeAsync).toHaveBeenCalledWith('tank/set', { qos: 1 });
  expect(heater.generateConfig()).not.toHaveProperty('state_topic');
  expect(heater.generateConfig()).not.toHaveProperty('command_topic');
  expect(() => heater.setMode('gas')).toThrow(RangeError);
});
