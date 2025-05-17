import _ from 'lodash';

const noop = _.noop;

export interface DiscoverableLogger {
  debug: (msg: string, data?: Record<string, unknown>) => void;
  info: (msg: string, data?: Record<string, unknown>) => void;
  warn: (msg: string, data?: Record<string, unknown>) => void;
  error: (msg: string, data?: Record<string, unknown>) => void;
}

export const noopLogger: DiscoverableLogger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};
