import { ColorObject } from '../../types/color-mode-validator';
import { ColorMode } from '../../types';
import { AutocompleteString } from '../../types/autocomplete-string';

export type LightState = {
  state: AutocompleteString<'ON' | 'OFF'>;
  color?: ColorObject;
  color_mode?: ColorMode;
  brightness?: number;
  /** Color temperature in mired */
  color_temp?: number;
  /** White value (single channel) */
  white_value?: number;
  /** Transition duration in seconds */
  transition?: number;
  /** Flash instruction: 'short' or 'long' */
  flash?: 'short' | 'long';
  effect?: string;
};

// See: https://www.home-assistant.io/integrations/light.mqtt/#json-schema
