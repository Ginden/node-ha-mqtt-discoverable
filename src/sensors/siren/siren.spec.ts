import { expect, test } from 'vitest';
import { Siren, SirenInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('uses custom power payloads unless explicit state payloads override them', async () => {
  const { client, manager } = mqttTestContext();
  const siren = new Siren(
    SirenInfo.create({
      name: 'Siren',
      payloadOn: '1',
      payloadOff: '0',
      stateOff: 'silent',
      availableTones: ['alarm', 2],
      supportDuration: true,
      retain: false,
    }),
    manager,
  );
  await siren.switchOn();
  await siren.switchOff();
  expect(client.publishAsync).toHaveBeenCalledWith('hmd/siren/Siren/state', '1', { retain: false });
  expect(client.publishAsync).toHaveBeenLastCalledWith('hmd/siren/Siren/state', 'silent', {
    retain: false,
  });
  expect(siren.generateConfig()).toMatchObject({
    available_tones: ['alarm', 2],
    support_duration: true,
  });
});
