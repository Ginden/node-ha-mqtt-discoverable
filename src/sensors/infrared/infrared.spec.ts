import { expect, test, vi } from 'vitest';
import { setImmediate } from 'timers/promises';
import {
  InfraredEmitter,
  InfraredEmitterInfo,
  InfraredReceiver,
  InfraredReceiverInfo,
} from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('receives structured infrared transmission requests using the emitter schema', async () => {
  const { client, manager } = mqttTestContext();
  const emitter = new InfraredEmitter(InfraredEmitterInfo.create({ name: 'Transmitter' }), manager);
  expect(emitter.generateConfig()).toMatchObject({ schema: 'emitter' });
  expect(emitter.generateConfig()).not.toHaveProperty('state_topic');
  const handler = vi.fn();
  emitter.on('command.json', handler);
  await emitter.subscribe();
  const command = { timings: [9000, -4500, 562], modulation: 38000, repeat_count: 2 };
  client.emit('message', emitter.commandTopic, Buffer.from(JSON.stringify(command)), {});
  await setImmediate();
  expect(handler).toHaveBeenCalledWith(command, emitter, emitter.commandTopic, expect.any(Object));
});

test('publishes infrared receptions as non-retained JSON and rejects malformed timings', async () => {
  const { client, manager } = mqttTestContext();
  const receiver = new InfraredReceiver(
    InfraredReceiverInfo.create({ name: 'Receiver', stateTopic: 'ir/captured' }),
    manager,
  );
  const signal = { timings: [9000, -4500, 562], modulation: null };
  await receiver.receive(signal);
  expect(receiver.generateConfig()).toMatchObject({
    schema: 'receiver',
    state_topic: 'ir/captured',
  });
  expect(receiver.generateConfig()).not.toHaveProperty('command_topic');
  expect(client.publishAsync).toHaveBeenLastCalledWith('ir/captured', JSON.stringify(signal), {
    retain: false,
  });
  expect(() => receiver.receive({ timings: [] })).toThrow();
  expect(() => receiver.receive({ timings: [0.5] })).toThrow();
});
