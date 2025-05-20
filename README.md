# ha-mqtt-discoverable (Node.js)

A Node.js library for Home Assistant MQTT discovery, ported from the original Python [ha-mqtt-discoverable](https://github.com/unixorn/ha-mqtt-discoverable) library. Depends on [`mqtt.js`](https://github.com/mqttjs/MQTT.js) for MQTT support.

## Features

- Publish Home Assistant MQTT discovery messages for sensors, switches, lights, and more
- Automatic topic generation and payload formatting
- Support for dynamic updates and removal of discovered entities

## Installation

```bash
npm install @ginden/ha-mqtt-discoverable
```

### API docs

Automatically generated using [typedoc](https://typedoc.org/) are available through [GitHub Pages](https://ginden.github.io/node-ha-mqtt-discoverable/).

### Usage

`Discoverable` _de facto_ extends built-in `EventEmitter` class (using some indirection).

All subclasses of `Subscriber` (entities that can be updated from Home Assistant) emit the following events:

- `command.json` - emitted when a command is received from Home Assistant. The payload is the parsed JSON object.
- `command.string` - emitted when a command is received from Home Assistant. The payload is the raw string.
- `command.raw` - emitted when a command is received from Home Assistant, but the payload cannot be parsed. The payload is raw Buffer.

All subclasses of `Discoverable` emit the following events:

- `error` - emitted when an error occurs. The payload is the error object.
- `connected` - emitted when the entity is connected to the MQTT broker. The payload is the discoverable itself.
- `write-config` - emitted when the entity is written to the MQTT broker. The payload is `[Discoverable, config: Record<string, any>]`.

### TODO

Quite a lot! While I implemented all features from the original library, there is still a lot to do here.

See [TODO.md](./TODO.md) for a more detailed list.

### Examples

Simple example:

```typescript
import { connect } from 'mqtt';
import {
  DeviceInfo,
  HaDiscoverableGlobalSettings,
  NumberInfo,
  Number,
} from '@ginden/ha-mqtt-discoverable';

// Connect to the MQTT broker
const client = await connect(`mqtt://localhost:1883`);

const settings = HaDiscoverableGlobalSettings.fromProperties({
  client,
});

const numberInfo = NumberInfo.create({
  device: DeviceInfo.create({
    name: 'Fake device',
    identifiers: ['fake-device'],
  }),
  name: 'Counter',
  min: 0,
  max: 100,
});

let i = 0;

const numberSensor = new Number(numberInfo, settings).on('command.json', (payload: number) => {
  i = payload;
  console.log('Command received:', payload);
});

await numberSensor.setValue(i);

await setInterval(() => {
  i = (i + 1) % numberInfo.max;
}, 1000);
```

- [Blinkstick example](./examples/blinkstick/index.mjs) using [my other library](https://github.com/Ginden/blinkstick-node-v2)

### Good practices

- Create a bridge class between your device and HA representation. This will get ugly really fast if you try to do everything in the callback. This is especially important for devices with multiple entities (e.g. a light with a color temperature and brightness).

## Contributing

Contributions and suggestions are welcome! Please open an issue or pull request on GitHub.

Quick overview of available commands:

- `npm run prepare` - build the project
- `npm run lint` - run ESLint
- `npm run lint:fix` - run ESLint and fix issues
- `npm run prettier` - run Prettier with `--write` flag

## License

Apache 2.0
