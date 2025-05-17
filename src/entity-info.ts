import { Validate } from './validate';
import { z } from 'zod';
import { DeviceInfo } from './device-info';
import { ConditionalPick, JsonValue, WritableKeysOf } from 'type-fest';
import { PropertyMap } from './types/property-map';

const uniqueSymbol = Symbol('Disallow direct instantiation');

/**
 * Base information for an MQTT entity used by Home Assistant discovery.
 */
export abstract class EntityInfo {
  static create<DerivedEntityInfo extends EntityInfo>(
    this: new (key: unknown) => DerivedEntityInfo,
    properties: Partial<
      ConditionalPick<
        Pick<DerivedEntityInfo, WritableKeysOf<DerivedEntityInfo>>,
        JsonValue | undefined
      >
    >,
  ): DerivedEntityInfo {
    const ret = new this(uniqueSymbol);

    for (const [key, value] of Object.entries(properties)) {
      if (value !== undefined) {
        (ret as Record<keyof DerivedEntityInfo, unknown>)[key as keyof DerivedEntityInfo] = value;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).wholeValidation(ret);

    return ret;
  }

  /**
   * Validates that `uniqueId` is set if `device` is provided.
   */
  static wholeValidation(obj: EntityInfo): asserts obj is EntityInfo {
    const device = obj.device;
    const uniqueId = obj.uniqueId;
    if (device !== undefined && uniqueId === undefined) {
      throw new Error('A unique_id is required if a device is defined');
    }
  }

  /** One of the supported MQTT components, for instance `binary_sensor` */
  abstract readonly component: string;

  /** Information about the device this sensor belongs to */
  @Validate(() => z.instanceof(DeviceInfo).optional())
  device?: DeviceInfo;

  /**
   * Sets the class of the device, changing the device state and icon that is
   * displayed on the frontend.
   */
  @Validate(z.string().optional())
  deviceClass?: string;

  /** Flag which defines if the entity should be enabled when first added. */
  @Validate(z.boolean().optional())
  enabledByDefault?: boolean;

  /** Classification of a non-primary entity. */
  @Validate(z.string().optional())
  entityCategory?: string;

  /**
   * If set, it defines the number of seconds after the sensor’s state expires,
   * if it’s not updated. After expiry, the sensor’s state becomes unavailable.
   * Default the sensors state never expires.
   */
  @Validate(z.number().int().optional())
  expireAfter?: number;

  /**
   * Sends update events even if the value hasn’t changed.
   * Useful if you want to have meaningful value graphs in history.
   */
  @Validate(z.boolean().optional())
  forceUpdate?: boolean;

  /** Icon of the entity */
  @Validate(z.string().optional())
  icon?: string;

  /** Name of the sensor inside Home Assistant */
  @Validate(z.string())
  name: string;

  /** Set this to generate the `entity_id` in HA instead of using `name` */
  @Validate(z.string().optional())
  objectId?: string;

  /** The maximum QoS level to be used when receiving messages. */
  @Validate(z.number().int().optional())
  qos?: number;

  /** Set this to enable editing sensor from the HA ui and to integrate with a device */
  @Validate(z.string().optional())
  uniqueId?: string;

  /**
   *
   * @param key This is a unique symbol to prevent direct instantiation of this class.
   * @throws Error if the class is instantiated directly.
   * @internal
   * @private
   */
  constructor(key: unknown) {
    if (key !== uniqueSymbol) {
      throw new Error(
        `${this.constructor.name} cannot be instantiated directly. Use the static create() method instead.`,
      );
    }
  }

  /**
   * Generates a JSON object that can be used as an MQTT payload.
   */
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
      if (mappedKey === 'device') {
        ret[mappedKey] = (value as DeviceInfo).modelDump();
      } else {
        ret[mappedKey] = value;
      }
    }

    return ret;
  }

  /**
   * Mapping of class properties to MQTT payload keys.
   * Merges subclass mappings via super.propertyMap().
   */
  protected propertyMap() {
    const map = {
      component: 'component',
      device: 'device',
      deviceClass: 'device_class',
      enabledByDefault: 'enabled_by_default',
      entityCategory: 'entity_category',
      expireAfter: 'expire_after',
      forceUpdate: 'force_update',
      icon: 'icon',
      name: 'name',
      objectId: 'object_id',
      qos: 'qos',
      uniqueId: 'unique_id',
    } as const;

    return map satisfies PropertyMap<EntityInfo>;
  }
}
