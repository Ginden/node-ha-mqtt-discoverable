import { EventEmitter } from 'events';
import { ConditionalPick } from 'type-fest';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type InternalMethods = keyof ConditionalPick<EventEmitter, Function>;

type Callback<Args extends unknown[]> = (...args: Args) => unknown;

type KeyOf<T> = keyof T & string;

// This insanity is caused by bad typing in the ` @types / node ` package
export class CustomEventEmitter<EventMap extends Record<string, unknown[]>>
  implements Record<InternalMethods, unknown>
{
  private readonly eventEmitter: EventEmitter;
  constructor(options?: { captureRejections?: boolean }) {
    this.eventEmitter = new EventEmitter(options);
  }

  addListener<EventName extends KeyOf<EventMap>>(
    event: EventName,
    listener: Callback<EventMap[EventName]>,
  ): this {
    return this.callInternalMethod('addListener', event, listener);
  }
  once<EventName extends KeyOf<EventMap>>(
    event: EventName,
    listener: Callback<EventMap[EventName]>,
  ): this {
    return this.callInternalMethod('once', event, listener);
  }
  removeListener<EventName extends KeyOf<EventMap>>(
    event: EventName,
    listener: Callback<EventMap[EventName]>,
  ): this {
    return this.callInternalMethod('removeListener', event, listener);
  }
  off<EventName extends keyof EventMap & string>(
    event: EventName,
    listener: Callback<EventMap[EventName]>,
  ): this {
    return this.callInternalMethod('off', event, listener);
  }
  removeAllListeners<EventName extends KeyOf<EventMap>>(event?: EventName): this {
    return this.callInternalMethod('removeAllListeners', event);
  }
  setMaxListeners(n: number): this {
    return this.callInternalMethod('setMaxListeners', n);
  }
  getMaxListeners() {
    return this.callInternalMethod('getMaxListeners');
  }
  listeners<EventName extends KeyOf<EventMap>>(event: EventName) {
    return this.callInternalMethod('listeners', event);
  }
  rawListeners<EventName extends KeyOf<EventMap>>(event: EventName) {
    return this.callInternalMethod('rawListeners', event);
  }
  emit<EventName extends KeyOf<EventMap>>(event: EventName, ...args: EventMap[EventName]): boolean {
    return this.callInternalMethod('emit', event, ...args);
  }

  /**
   * Emits an event without waiting for the listeners to finish.
   * @param event
   * @param args
   */
  emitVoid<EventName extends KeyOf<EventMap>>(
    event: EventName,
    ...args: EventMap[EventName]
  ): void {
    setImmediate(() => {
      try {
        this.callInternalMethod('emit', event, ...args);
      } catch (e) {
        this.callInternalMethod('emit', 'error', e);
      }
    });
  }
  listenerCount<EventName extends KeyOf<EventMap>>(event: EventName): number {
    return this.callInternalMethod('listenerCount', event);
  }
  prependListener<EventName extends KeyOf<EventMap>>(
    event: EventName,
    listener: Callback<EventMap[EventName]>,
  ): this {
    return this.callInternalMethod('prependListener', event, listener);
  }
  prependOnceListener<EventName extends KeyOf<EventMap>>(
    event: EventName,
    listener: Callback<EventMap[EventName]>,
  ): this {
    return this.callInternalMethod('prependOnceListener', event, listener);
  }
  eventNames(): Array<PropertyKey | (KeyOf<EventMap> & {})> {
    return this.callInternalMethod('eventNames');
  }

  on<EventName extends KeyOf<EventMap>>(
    event: EventName,
    listener: (...args: EventMap[EventName]) => void,
  ): this {
    return this.callInternalMethod('on', event, listener);
  }

  private callInternalMethod<Method extends InternalMethods>(
    method: Method,
    ...args: Parameters<EventEmitter[Method]>
  ): ReturnType<EventEmitter[Method]> extends EventEmitter
    ? this
    : ReturnType<EventEmitter[Method]> {
    const ret: ReturnType<EventEmitter[Method]> = Reflect.apply(
      this.eventEmitter[method],
      this.eventEmitter,
      args,
    );
    if (ret === this.eventEmitter) {
      // @ts-expect-error TypeScript infers types wrongly
      return this;
    }
    // @ts-expect-error TypeScript infers types wrongly
    return ret;
  }
}
