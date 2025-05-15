import { z } from 'zod';
import { ColorMode } from '../types/color-mode';

export interface ColorModeSelector {
  [ColorMode.rgb]: RgbColor;
  [ColorMode.rgbw]: RgbwColor;
  [ColorMode.rgbww]: RgbwwColor;
  [ColorMode.xy]: XyColor;
  [ColorMode.hs]: HsColor;
}

const xyColor = z.object({
  x: z.number(),
  y: z.number(),
});

interface XyColor {
  // X coordinate
  x: number;
  // Y coordinate
  y: number;
}

const hsColor = z.object({
  h: z.number(),
  s: z.number(),
});

interface HsColor {
  // Hue
  h: number;
  // Saturation
  s: number;
}

const rgbColor = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
});

interface RgbColor extends z.infer<typeof rgbColor> {
  // Red
  r: number;
  // Green
  g: number;
  // Blue
  b: number;
}

const rgbwColor = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
  w: z.number(),
});

interface RgbwColor extends RgbColor, z.infer<typeof rgbwColor> {
  // White
  w: number;
}

const rgbwwColor = z.object({
  r: z.number(),
  g: z.number(),
  b: z.number(),
  c: z.number(),
  w: z.number(),
});

interface RgbwwColor extends RgbColor, z.infer<typeof rgbwwColor> {
  // Cool white
  c: number;
  // Warm white
  w: number;
}

export type ColorObject = ColorModeSelector[keyof ColorModeSelector];

/**
 * Validates the color mode and its value.
 * @param colorMode The color mode to validate.
 * @param value The value to validate.
 * @returns True if the value is valid for the given color mode, false otherwise.
 */
export function colorModeValidator<GivenColorMode extends ColorMode>(
  colorMode: GivenColorMode,
  value: ColorModeSelector[GivenColorMode],
): value is ColorModeSelector[GivenColorMode] {
  switch (colorMode) {
    case ColorMode.xy:
      return xyColor.safeParse(value).success;
    case ColorMode.hs:
      return hsColor.safeParse(value).success;
    case ColorMode.rgb:
      return rgbColor.safeParse(value).success;
    case ColorMode.rgbw:
      return rgbwColor.safeParse(value).success;
    case ColorMode.rgbww:
      return rgbwwColor.safeParse(value).success;
  }
  throw new TypeError(`Color mode ${colorMode} is not valid`);
}
