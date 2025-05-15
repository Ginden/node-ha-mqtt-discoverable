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

const numberSensor = new Number(numberInfo, settings, (haSetValue) => {
  i = haSetValue;
  console.log(`User in HA set value to ${haSetValue}`);
});

await numberSensor.setValue(i);

await setInterval(() => {
  i = (i + 1) % numberInfo.max;
}, 1000);
```

- [Blinkstick example](./examples/blinkstick/index.mjs) using [my other library](https://github.com/Ginden/blinkstick-node-v2)

### Working with

## Contributing

Contributions and suggestions are welcome! Please open an issue or pull request on GitHub.

Quick overview of available commands:

- `npm run prepare` - build the project
- `npm run lint` - run ESLint
- `npm run lint:fix` - run ESLint and fix issues
- `npm run prettier` - run Prettier with `--write` flag

## License

Apache 2.0
