# TODO

Tests are missing. Proper setup would spawn a broker and Home Assistant instance using `testcontainers`, and test the library against them, with the possible necessity of running the whole browser instance to retrieve API keys. If you want to help with this, please open an issue or pull request.

## Missing entity types

The following entity types are currently missing. As Home Assistant continues to evolve, [new MQTT integrations are added](https://www.home-assistant.io/integrations/?search=mqtt), so this list may be out of date.

- [ ] [Device tracker](https://www.home-assistant.io/integrations/device_tracker.mqtt/)
- [ ] [Fan](https://www.home-assistant.io/integrations/fan.mqtt/)
- [ ] [HVAC](https://www.home-assistant.io/integrations/climate.mqtt/)
- [ ] [Lawn mower](https://www.home-assistant.io/integrations/lawn_mower.mqtt/)
- [ ] [Lock](https://www.home-assistant.io/integrations/lock.mqtt/)
- [ ] [Alarm control panel](https://www.home-assistant.io/integrations/alarm_control_panel.mqtt/)
- [ ] [Scene](https://www.home-assistant.io/integrations/scene.mqtt/)
- [ ] [Siren](https://www.home-assistant.io/integrations/siren.mqtt/)
- [ ] [Tag scanner](https://www.home-assistant.io/integrations/tag.mqtt/)
- [ ] [Vacuum](https://www.home-assistant.io/integrations/vacuum.mqtt/)
- [ ] [Valve](https://www.home-assistant.io/integrations/valve.mqtt/)
- [ ] [Water heater](https://www.home-assistant.io/integrations/water_heater.mqtt/)
- [ ] [Firmware update](https://www.home-assistant.io/integrations/update.mqtt/)

## Missing types

Currently, a library will give you rather bad types for callbacks (aka `unknown` for most of the callbacks) on `Subscriber` instances.

## Save bandwidth

Currently, mostly long property names are used. This is easier to debug, but in bandwidth-constrained environments this is rather suboptimal. Some kind of translation table should be used to convert between the long and short names. This is not a priority for me, but if you want to help with this, please open an issue or pull request.

### Discovery batching

Combine multiple entity configuration payloads into a single message to save bandwidth and provide atomic updates.

This is a relatively new feature in Home Assistant, and I'm not sure if it's supported by any of the existing libraries.

## Other missing features

- General:
  - [ ] Dynamic re-discovery: republishing discovery/config messages when entity properties change at runtime
  - [ ] Removal of entities: currently, entities are removed only when you manually call `.unregister()`. This is not a problem for most use cases, but it would be nice to have this feature.
  - [ ] Support for birth/will messages

### Incomplete support

- Cover:
  - [ ] tilt controls (`tilt_position`, `tilt_command`, `tilt_state`)
- Templates:
  - [ ] `command_template` (for switch/light/cover commands)
  - [ ] `state_template` support for switches/covers
