import { MessageCallback } from '../settings';

export function wrapCallbackWithNoParse<T extends MessageCallback>(cb: T): T & { parse: false } {
  const wrappedCallback = ((...args: Parameters<T>) => {
    // @ts-expect-error -- TS hates generic rest parameters
    return cb(...args);
  }) as T & { parse: false };
  wrappedCallback.parse = false;
  return wrappedCallback;
}
