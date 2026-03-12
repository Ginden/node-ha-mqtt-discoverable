import { EventEmitter } from 'events';
import { setImmediate } from 'timers/promises';
import { expect, suite, test, vi } from 'vitest';
import { Switch } from '../sensors/switch/switch';
import { SwitchInfo } from '../sensors/switch/switch-info';
import { HaDiscoverableManager } from './ha-discoverables-manager';

class FakeMqttClient extends EventEmitter {
  connected = false;
  publishAsync = vi.fn(async () => undefined);
  subscribeAsync = vi.fn(async () => []);

  emitConnect() {
    this.connected = true;
    this.emit('connect');
  }
}

suite(HaDiscoverableManager.name, () => {
  test('reruns discoverable initialization after reconnect', async () => {
    const client = new FakeMqttClient();
    const manager = new HaDiscoverableManager(client as never);
    const entity = SwitchInfo.create({
      name: 'Test Switch',
    });

    new Switch(entity, manager);

    client.emitConnect();
    await setImmediate();

    expect(client.publishAsync).toHaveBeenCalledTimes(1);
    expect(client.subscribeAsync).toHaveBeenCalledTimes(1);

    client.connected = false;
    client.emitConnect();
    await setImmediate();

    expect(client.publishAsync).toHaveBeenCalledTimes(2);
    expect(client.subscribeAsync).toHaveBeenCalledTimes(2);
  });

  test('calls callbacks added while connected immediately and on later reconnects', async () => {
    const client = new FakeMqttClient();
    client.connected = true;
    const manager = new HaDiscoverableManager(client as never);
    const callback = vi.fn();

    manager.addConnectCallback(callback);
    await setImmediate();

    expect(callback).toHaveBeenCalledTimes(1);

    client.connected = false;
    client.emitConnect();
    await setImmediate();

    expect(callback).toHaveBeenCalledTimes(2);
  });
});
