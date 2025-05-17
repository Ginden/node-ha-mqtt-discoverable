import { test, expect, suite } from 'vitest';
import { BinarySensorInfo } from './binary-sensor-info';
import { DeviceInfo } from '../../device-info';

suite(BinarySensorInfo.name, () => {
  test('Should create a BinarySensorInfo instance with default values', () => {
    const binarySensorInfo = BinarySensorInfo.create({
      name: 'test',
    });
    expect(binarySensorInfo).toBeInstanceOf(BinarySensorInfo);
    expect(binarySensorInfo.component).toBe('binary_sensor');
    expect(binarySensorInfo.deviceClass).toBeUndefined();
    expect(binarySensorInfo.name).toBe('test');
  });

  test('Should throw if device was given, but not uniqueId', () => {
    expect(() => {
      BinarySensorInfo.create({
        device: DeviceInfo.create({
          name: 'Test Device',
          identifiers: ['12345'],
        }),
      });
    }).toThrowError('A unique_id is required if a device is defined');
  });
});
