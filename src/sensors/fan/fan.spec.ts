import { EventEmitter } from 'events';
import { expect, suite, test, vi } from 'vitest';
import { HaDiscoverableManager } from '../../settings';
import { Fan } from './fan';
import { FanInfo } from './fan-info';

class FakeMqttClient extends EventEmitter {
  connected = false;
  publishAsync = vi.fn(async () => undefined);
  subscribeAsync = vi.fn(async () => []);
}

suite('MQTT fan', () => {
  test('writes fan discovery configuration', async () => {
    const client = new FakeMqttClient();
    const manager = new HaDiscoverableManager(client as never);
    const fan = new Fan(
      FanInfo.create({
        name: 'Bedroom Fan',
        directionCommandTopic: 'bedroom/fan/direction/command',
        directionStateTopic: 'bedroom/fan/direction/state',
        percentageCommandTopic: 'bedroom/fan/percentage/command',
        percentageStateTopic: 'bedroom/fan/percentage/state',
        presetModes: ['eco', 'boost'],
      }),
      manager,
    );

    await fan.register();

    expect(client.publishAsync).toHaveBeenCalledWith(
      'homeassistant/fan/Bedroom-Fan/config',
      JSON.stringify({
        name: 'Bedroom Fan',
        component: 'fan',
        direction_command_topic: 'bedroom/fan/direction/command',
        direction_state_topic: 'bedroom/fan/direction/state',
        payload_off: 'OFF',
        payload_on: 'ON',
        payload_oscillation_off: 'oscillate_off',
        payload_oscillation_on: 'oscillate_on',
        percentage_command_topic: 'bedroom/fan/percentage/command',
        percentage_state_topic: 'bedroom/fan/percentage/state',
        preset_modes: ['eco', 'boost'],
        speed_range_max: 100,
        speed_range_min: 1,
        state_topic: 'hmd/fan/Bedroom-Fan/state',
        json_attributes_topic: 'hmd/fan/Bedroom-Fan/attributes',
        command_topic: 'hmd/fan/Bedroom-Fan/state/command',
      }),
      { retain: true, properties: { messageExpiryInterval: 2419200 } },
    );
  });

  test('publishes supported fan state updates', async () => {
    const client = new FakeMqttClient();
    const manager = new HaDiscoverableManager(client as never);
    const fan = new Fan(
      FanInfo.create({
        name: 'Bedroom Fan',
        directionStateTopic: 'bedroom/fan/direction/state',
        oscillationStateTopic: 'bedroom/fan/oscillation/state',
        percentageStateTopic: 'bedroom/fan/percentage/state',
        presetModeStateTopic: 'bedroom/fan/preset/state',
        presetModes: ['eco'],
        retain: false,
      }),
      manager,
    );

    await fan.switchOn();
    await fan.setDirection('reverse');
    await fan.setOscillation(true);
    await fan.setPercentage(50);
    await fan.setPresetMode('eco');

    expect(client.publishAsync).toHaveBeenLastCalledWith('bedroom/fan/preset/state', 'eco', {
      retain: false,
    });
    expect(client.publishAsync).toHaveBeenCalledWith('hmd/fan/Bedroom-Fan/state', 'ON', {
      retain: false,
    });
    expect(client.publishAsync).toHaveBeenCalledWith('bedroom/fan/direction/state', 'reverse', {
      retain: false,
    });
    expect(client.publishAsync).toHaveBeenCalledWith(
      'bedroom/fan/oscillation/state',
      'oscillate_on',
      { retain: false },
    );
    expect(client.publishAsync).toHaveBeenCalledWith('bedroom/fan/percentage/state', '50', {
      retain: false,
    });
  });

  test('subscribes to every configured command topic and validates values', async () => {
    const client = new FakeMqttClient();
    const manager = new HaDiscoverableManager(client as never);
    const fan = new Fan(
      FanInfo.create({
        name: 'Bedroom Fan',
        directionCommandTopic: 'bedroom/fan/direction/command',
        oscillationCommandTopic: 'bedroom/fan/oscillation/command',
        percentageCommandTopic: 'bedroom/fan/percentage/command',
        presetModeCommandTopic: 'bedroom/fan/preset/command',
        percentageStateTopic: 'bedroom/fan/percentage/state',
        presetModes: ['eco'],
      }),
      manager,
    );

    await fan.subscribe();

    expect(client.subscribeAsync).toHaveBeenCalledTimes(5);
    expect(() => fan.setPercentage(0)).toThrow(
      'Fan percentage is not within configured speed range',
    );
    expect(() => fan.setPresetMode('boost')).toThrow('Preset mode boost is not configured');
    expect(() => fan.setDirection('forward')).toThrow('direction state topic is not configured');
  });
});
