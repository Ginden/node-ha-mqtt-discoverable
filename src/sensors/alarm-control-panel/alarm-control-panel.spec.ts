import { expect, test, vi } from 'vitest';
import { setImmediate } from 'timers/promises';
import { AlarmControlPanel, AlarmControlPanelInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('publishes armed state and supports templated remote code commands', async () => {
  const { client, manager } = mqttTestContext();
  const alarm = new AlarmControlPanel(
    AlarmControlPanelInfo.create({
      name: 'Alarm',
      code: 'REMOTE_CODE',
      commandTemplate: '{{ action }}:{{ code }}',
      codeArmRequired: true,
    }),
    manager,
  );
  await alarm.updateState('armed_away');
  expect(client.publishAsync).toHaveBeenLastCalledWith(
    'hmd/alarm_control_panel/Alarm/state',
    'armed_away',
    { retain: true },
  );
  expect(alarm.generateConfig()).toMatchObject({
    code: 'REMOTE_CODE',
    command_template: '{{ action }}:{{ code }}',
    code_arm_required: true,
  });
  const handler = vi.fn();
  alarm.on('command.string', handler);
  await alarm.subscribe();
  client.emit('message', alarm.commandTopic, Buffer.from('DISARM:1234'), {});
  await setImmediate();
  expect(handler).toHaveBeenCalledWith(
    'DISARM:1234',
    alarm,
    alarm.commandTopic,
    expect.any(Object),
  );
});
