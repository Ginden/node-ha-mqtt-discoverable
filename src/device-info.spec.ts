import { test, expect, suite } from 'vitest';
import { DeviceInfo } from './device-info';

suite(DeviceInfo.name, () => {
  test('Throws if neither identifiers nor connections are set', () => {
    expect(() => {
      DeviceInfo.create({
        name: 'Test Device',
      });
    }).toThrowError('Define identifiers or connections');
  });

  test('Throws if no name is set', () => {
    expect(() =>
      DeviceInfo.create({
        identifiers: ['12345'],
      } as never),
    ).toThrowError();
  });
});
