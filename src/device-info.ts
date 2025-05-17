import { runValidation, Validate } from './validate';
import { z } from 'zod';
import { ConditionalPick, JsonValue } from 'type-fest';

const uniqueSymbol = Symbol('Disallow direct instantiation');

/**
 * Information about a device a sensor belongs to
 */
export class DeviceInfo {
  static create(data: ConditionalPick<DeviceInfo, JsonValue | undefined>): DeviceInfo {
    const deviceInfo = new DeviceInfo(uniqueSymbol);
    Object.assign(deviceInfo, data);
    DeviceInfo.wholeValidation(deviceInfo);
    return deviceInfo;
  }

  /**
   * Validates that either `identifiers` or `connections` is set.
   */
  static wholeValidation(obj: DeviceInfo): asserts obj is DeviceInfo {
    const identifiers = obj.identifiers;
    const connections = obj.connections;
    if (!identifiers?.length && !connections?.length) {
      throw new Error('Define identifiers or connections');
    }

    runValidation(obj);
  }

  /** Name of the device */
  @Validate(z.string())
  name: string;

  /** Model of the device */
  @Validate(z.string().optional())
  model?: string;

  /** Manufacturer of the device */
  @Validate(z.string().optional())
  manufacturer?: string;

  /** Firmware version of the device */
  @Validate(z.string().optional())
  swVersion?: string;

  /** Hardware version of the device */
  @Validate(z.string().optional())
  hwVersion?: string;

  /** A list of IDs that uniquely identify the device. For example a serial number. */
  @Validate(z.any(/* TODO: list of strings or single string */).optional())
  identifiers?: string[] | string;

  /** A list of connections of the device to the outside world as a list of tuples [connection_type, connection_identifier] */
  @Validate(z.array(z.tuple([z.unknown(), z.unknown()])).optional())
  connections?: [unknown, unknown][];

  /** A link to the webpage that can manage the configuration of this device. Can be either an HTTP or HTTPS link. */
  @Validate(z.string().optional())
  configurationUrl?: string;

  /** Identifier of a device that routes messages between this device and Home Assistant. Examples of such devices are hubs, or parent devices of a sub-device. This is used to show device topology in Home Assistant. */
  @Validate(z.string().optional())
  viaDevice?: string;

  constructor(key: unknown) {
    if (key !== uniqueSymbol) {
      throw new Error(
        `${this.constructor.name} cannot be instantiated directly. Use the static create() method instead.`,
      );
    }
  }

  modelDump(): Record<string, unknown> {
    const ret = {} as Record<string, unknown>;
    const propertyMap = this.propertyMap() as Record<string, string>;
    for (const [key, value] of Object.entries(this)) {
      if (value == null) {
        continue;
      }
      const mappedKey = propertyMap[key];
      if (!mappedKey) {
        // Should we do this or not?
        continue;
      }

      ret[mappedKey] = value;
    }

    return ret;
  }

  /** Mapping of class properties to MQTT payload keys */
  /**
   * Mapping of class properties to MQTT payload keys.
   * Merges subclass mappings via super.propertyMap().
   */
  protected propertyMap() {
    return {
      name: 'name',
      model: 'model',
      manufacturer: 'manufacturer',
      swVersion: 'sw_version',
      hwVersion: 'hw_version',
      identifiers: 'identifiers',
      connections: 'connections',
      configurationUrl: 'configuration_url',
      viaDevice: 'via_device',
    } as const satisfies Partial<Record<string, string>>;
  }
}
