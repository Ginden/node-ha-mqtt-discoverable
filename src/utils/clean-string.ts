import { z } from 'zod';

/**
 * Replace characters not matching [A-Za-z0-9_-] with '-' to
 * conform to MQTT discovery topic name requirements.
 *
 * Based on Python implementation in clean_string.py.
 */
export function cleanString(raw: string): string {
  // TODO: original Python code: re.sub(r"[^A-Za-z0-9_-]", "-", raw)
  return raw.replace(/[^A-Za-z0-9_-]/g, '-');
}

export const zodCleanString = z.string().refine((val) => cleanString(val) === val);
