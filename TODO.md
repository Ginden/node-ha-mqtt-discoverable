# TODO

Tests are missing. Proper setup would spawn a broker and Home Assistant instance using `testcontainers`, and test the library against them, with the possible necessity of running the whole browser instance to retrieve API keys. If you want to help with this, please open an issue or pull request.

## Missing entity types

The following entity types are currently missing. As Home Assistant continues to evolve, [new MQTT integrations are added](https://www.home-assistant.io/integrations/?search=mqtt), so this list may be out of date.

- [ ] Device tracker
- [ ] Lock
- [ ] Fan
- [ ] Lawn mower
- [ ] Scene
- [ ] Vacuum
- [ ] Valve
- [ ] Water heater
- [ ] Tag scanner
- [ ] Siren
- [ ] HVAC

## Missing types

Currently, library will give you rather bad types for callbacks (aka `unknown` for most of the callbacks) on `Subscriber` instances.

## Save bandwidth

Currently, mostly long property names are used. This is easier to debug, but in bandwidth-constrained environments this is rather suboptimal.
