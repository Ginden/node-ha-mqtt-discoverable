# TODO

Unit tests cover discovery payloads, state publications, commands, reconnects, and transport failures. Integration tests against a real broker and Home Assistant instance are still needed.

## MQTT entity coverage

The formerly missing entity types below are now implemented. As Home Assistant continues to evolve, [new MQTT integrations are added](https://www.home-assistant.io/integrations/?search=mqtt), so this list may be out of date.

- [x] [Device tracker](https://www.home-assistant.io/integrations/device_tracker.mqtt/)
- [x] [Event](https://www.home-assistant.io/integrations/event.mqtt/)
- [x] [Fan](https://www.home-assistant.io/integrations/fan.mqtt/)
- [x] [HVAC](https://www.home-assistant.io/integrations/climate.mqtt/)
- [x] [Humidifier](https://www.home-assistant.io/integrations/humidifier.mqtt/)
- [x] [Infrared](https://www.home-assistant.io/integrations/infrared.mqtt/)
- [x] [Lawn mower](https://www.home-assistant.io/integrations/lawn_mower.mqtt/)
- [x] [Lock](https://www.home-assistant.io/integrations/lock.mqtt/)
- [x] [Notify](https://www.home-assistant.io/integrations/notify.mqtt/)
- [x] [Alarm control panel](https://www.home-assistant.io/integrations/alarm_control_panel.mqtt/)
- [x] [Scene](https://www.home-assistant.io/integrations/scene.mqtt/)
- [x] [Siren](https://www.home-assistant.io/integrations/siren.mqtt/)
- [x] [Tag scanner](https://www.home-assistant.io/integrations/tag.mqtt/)
- [x] [Vacuum](https://www.home-assistant.io/integrations/vacuum.mqtt/)
- [x] [Valve](https://www.home-assistant.io/integrations/valve.mqtt/)
- [x] [Water heater](https://www.home-assistant.io/integrations/water_heater.mqtt/)
- [x] [Firmware update](https://www.home-assistant.io/integrations/update.mqtt/)

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
