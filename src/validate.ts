import { z, ZodSchema } from 'zod';
import _ from 'lodash';
import { Class } from 'type-fest';

const once = _.once;

const weakMap = new WeakMap<WeakKey, [PropertyKey, Factory][]>();

type Factory = () => ZodSchema;

export function Validate(schema: ZodSchema | (() => ZodSchema)) {
  const factory = typeof schema === 'function' ? once(schema) : () => schema;
  return function actualDecorator(_: unknown, context: ClassFieldDecoratorContext) {
    const { name, addInitializer } = context;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addInitializer(function init(this: any) {
      const ctor = this.constructor;
      const list = weakMap.get(ctor) ?? [];
      weakMap.set(ctor, list);
      list.push([name, factory]);
    });
  };
}

export function runValidation(obj: unknown): void {
  for (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctor: Class<unknown> = (obj as any).constructor;
    ctor && ctor !== Function;
    ctor = Object.getPrototypeOf(ctor)
  ) {
    const list = weakMap.get(ctor) ?? [];

    const objectValidator = z.object(Object.fromEntries(list.map(([key, f]) => [key, f()])));

    objectValidator.parse(obj);
  }
}
