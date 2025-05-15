// Taken from https://www.home-assistant.io/integrations/light.mqtt/#supported_color_modes
export const ColorMode = {
  hs: 'hs',
  xy: 'xy',
  rgb: 'rgb',
  rgbw: 'rgbw',
  rgbww: 'rgbww',
} as const;

export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode];
