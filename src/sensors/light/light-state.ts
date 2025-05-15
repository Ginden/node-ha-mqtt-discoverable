import { ColorObject } from '../../utils/color-mode-validator';
import { ColorMode } from '../../types';

export type LightState = {
  state: (('ON' | 'OFF') & {}) | string;
  color?: ColorObject;
  color_mode?: ColorMode;
  brightness?: number;
  effect?: string;
};

// See: https://www.home-assistant.io/integrations/light.mqtt/#json-schema
