import { expect, test, vi } from 'vitest';
import { setImmediate } from 'timers/promises';
import { Climate, ClimateInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('discovers named HVAC channels, publishes telemetry and routes auxiliary commands', async () => {
  const { client, manager } = mqttTestContext();
  const climate = new Climate(
    ClimateInfo.create({
      name: 'Thermostat',
      modes: ['off', 'heat'],
      temperatureUnit: 'C',
      currentTemperatureTopic: 'room/temperature',
      fanModeCommandTopic: 'room/fan/set',
      fanModeStateTopic: 'room/fan',
      fanModes: ['auto', 'low'],
      swingHorizontalModes: ['on', 'off'],
      actionTopic: 'room/action',
      temperatureHighCommandTopic: 'room/high/set',
      temperatureHighStateTopic: 'room/high',
    }),
    manager,
  );
  await climate.setCurrentTemperature(20.5);
  await climate.setTemperature(22);
  await climate.setFanMode('auto');
  await climate.setAction('heating');
  await climate.setTemperatureHigh(24);
  expect(client.publishAsync).toHaveBeenCalledWith('room/temperature', '20.5', { retain: true });
  expect(client.publishAsync).toHaveBeenCalledWith(
    'hmd/climate/Thermostat/state/temperature',
    '22',
    { retain: true },
  );
  expect(client.publishAsync).toHaveBeenCalledWith('room/fan', 'auto', { retain: true });
  expect(client.publishAsync).toHaveBeenCalledWith('room/action', 'heating', { retain: true });
  expect(client.publishAsync).toHaveBeenCalledWith('room/high', '24', { retain: true });
  const config = climate.generateConfig();
  expect(config).toMatchObject({
    temperature_unit: 'C',
    current_temperature_topic: 'room/temperature',
    swing_horizontal_modes: ['on', 'off'],
  });
  expect(config).not.toHaveProperty('command_topic');
  expect(config).not.toHaveProperty('state_topic');
  await climate.subscribe();
  const handler = vi.fn();
  climate.on('command.string', handler);
  for (const [topic, payload] of [
    ['room/fan/set', 'low'],
    ['room/high/set', '25'],
  ]) {
    client.emit('message', topic, Buffer.from(payload), {});
    await setImmediate();
    expect(handler).toHaveBeenCalledWith(payload, climate, topic, expect.any(Object));
  }
  expect(() => climate.setMode('cool')).toThrow(RangeError);
  expect(() => climate.setCurrentHumidity(50)).toThrow('current_humidity_topic is not configured');
});

test('restores each distinct command subscription and discovery after reconnect and HA restart', async () => {
  const { client, manager } = mqttTestContext();
  const climate = new Climate(
    ClimateInfo.create({
      name: 'Shared',
      fanModeCommandTopic: 'shared/set',
      swingModeCommandTopic: 'shared/set',
    }),
    manager,
  );
  client.emit('connect');
  await setImmediate();
  client.emit('connect');
  await setImmediate();
  expect(client.subscribeAsync.mock.calls.filter(([topic]) => topic === 'shared/set')).toHaveLength(
    2,
  );
  const handler = vi.fn();
  climate.on('command.string', handler);
  client.emit('message', 'shared/set', Buffer.from('auto'), {});
  await setImmediate();
  expect(handler).toHaveBeenCalledTimes(1);
  client.publishAsync.mockClear();
  client.emit('message', manager.mqttSettings.haStatusTopic!, Buffer.from('online'), {});
  await setImmediate();
  expect(client.publishAsync).toHaveBeenCalledWith(
    'homeassistant/climate/Shared/config',
    expect.any(String),
    expect.objectContaining({ retain: true }),
  );
});

test('propagates publish and subscribe failures and retries discovery on the next state update', async () => {
  const { client, manager } = mqttTestContext();
  const climate = new Climate(ClimateInfo.create({ name: 'Retry' }), manager);
  client.publishAsync.mockRejectedValueOnce(new Error('disconnected'));
  await expect(climate.setTemperature(20)).rejects.toThrow('disconnected');
  await climate.setTemperature(21);
  expect(client.publishAsync).toHaveBeenLastCalledWith(
    'hmd/climate/Retry/state/temperature',
    '21',
    { retain: true },
  );
  expect(
    client.publishAsync.mock.calls.filter(([topic]) => topic.endsWith('/config')),
  ).toHaveLength(2);
  client.subscribeAsync.mockRejectedValueOnce(new Error('subscription denied'));
  await expect(climate.subscribe()).rejects.toThrow('subscription denied');
});
