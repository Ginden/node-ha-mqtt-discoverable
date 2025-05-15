import { CONFIGURATION_KEY_NAMES } from './configuration-keys';

/**
 * Confirm that a configuration key is in the allowed list
 * Based on Python valid_configuration_key function.
 */
export function validConfigurationKey(name: string): boolean {
  return name in CONFIGURATION_KEY_NAMES;
}
