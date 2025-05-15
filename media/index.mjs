import { findFirst } from '@ginden/blinkstick-v2';
import { connect } from 'mqtt';

const { DeviceInfo, Light, LightInfo, HaDiscoverableGlobalSettings } = await import(
  '../../dist/index.js'
);

const blinkstick = findFirst();

if (!blinkstick) {
  throw new Error();
}
await blinkstick.setRandomColor();

const client = await connect({
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  servers: [
    {
      host: process.env.MQTT_HOST,
      port: process.env.MQTT_PORT,
    },
  ],
  protocol: 'mqtts',
  protocolVersion: 5,
});

client.on('connect', () => {
  console.log('MQTT connected');
});
client.on('error', (err) => {
  console.error('MQTT error', err);
});

const deviceInfo = DeviceInfo.create({
  name: 'TEST-Blinkstick',
  identifiers: [`TEST-${blinkstick.serial}`],
});

const lightCount = blinkstick.describeDevice()?.ledCount ?? 1;
const settings = HaDiscoverableGlobalSettings.fromProperties({
  client,
});

for (let i = 0; i < lightCount; i++) {
  const lightInfo = LightInfo.create({
    name: `TEST-Blinkstick-${i}`,
    identifiers: [`TEST-${blinkstick.serial}-${i}`],
    uniqueId: `TEST-${blinkstick.serial}-${i}`,
    manufacturer: 'Blinkstick',
    model: 'Blinkstick',
    sw_version: '1.0',
    device: deviceInfo,
    supportedColorModes: ['rgb'],
  });

  const light = new Light(lightInfo, settings, async ({ json: { state, color } }) => {
    if (state === 'OFF') {
      await blinkstick.setColor('black', { index: i });
    } else if (state === 'ON') {
      if (!color) {
        await blinkstick.setColor('white', { index: i });
      } else {
        await blinkstick.setColor(color.r, color.g, color.b, { index: i });
      }
    }
    const [r, g, b] = await blinkstick.getColor(i);
    light.updateState({
      state: r || g || b ? 'ON' : 'OFF',
      color: {
        r,
        g,
        b,
      },
      brightness: Math.max(r, g, b),
    });
  });
  await light.subscribe();
  await light.writeConfig();
}
