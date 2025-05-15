import { ConditionalPick, JsonValue } from 'type-fest';
import { DeviceInfo } from '../device-info';
import { CONFIGURATION_KEY_NAMES } from '../utils/configuration-keys';

/**
 * Allows auto-completion for the property map, but also allows an arbitrary string
 * @internal
 */
type AllowedPropertyMapValues = (keyof typeof CONFIGURATION_KEY_NAMES & {}) | string;

/**
 * A map of properties used for Home Assistant discovery.
 */
export type PropertyMap<T, ExcludedKeys extends string = never> = Record<
  Exclude<keyof ConditionalPick<T, JsonValue | undefined | DeviceInfo>, ExcludedKeys>,
  AllowedPropertyMapValues
>;
