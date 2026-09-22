import { TopicSubscriber } from '../topic-entity';
import { ClimateInfo } from './climate-info';

/** Home Assistant MQTT climate entity. */
export class Climate extends TopicSubscriber<ClimateInfo> {
  protected get topicDefaults() {
    return {
      mode_command_topic: 'mode/command',
      mode_state_topic: 'mode',
      temperature_command_topic: 'temperature/command',
      temperature_state_topic: 'temperature',
      current_temperature_topic: 'current-temperature',
    };
  }
  protected get commandTopicKeys() {
    return [
      'mode_command_topic',
      'fan_mode_command_topic',
      'power_command_topic',
      'preset_mode_command_topic',
      'swing_horizontal_mode_command_topic',
      'swing_mode_command_topic',
      'target_humidity_command_topic',
      'temperature_command_topic',
      'temperature_high_command_topic',
      'temperature_low_command_topic',
    ];
  }
  setTemperature(value: number) {
    return this.publishState('temperature_state_topic', value);
  }
  setCurrentTemperature(value: number) {
    return this.publishState('current_temperature_topic', value);
  }
  setMode(mode: string) {
    if (this.entity.modes && !this.entity.modes.includes(mode))
      throw new RangeError(`Mode ${mode} is not configured`);
    return this.publishState('mode_state_topic', mode);
  }
  setCurrentHumidity(value: number) {
    return this.publishState('current_humidity_topic', value);
  }
  setAction(value: 'off' | 'idle' | 'heating' | 'cooling' | 'drying' | 'fan' | 'defrosting') {
    return this.publishState('action_topic', value);
  }
  setTemperatureHigh(value: number) {
    return this.publishState('temperature_high_state_topic', value);
  }
  setTemperatureLow(value: number) {
    return this.publishState('temperature_low_state_topic', value);
  }
  setTargetHumidity(value: number) {
    return this.publishState('target_humidity_state_topic', value);
  }
  setFanMode(value: string) {
    return this.publishState('fan_mode_state_topic', value);
  }
  setPresetMode(value: string) {
    return this.publishState('preset_mode_state_topic', value);
  }
  setSwingMode(value: string) {
    return this.publishState('swing_mode_state_topic', value);
  }
  setSwingHorizontalMode(value: string) {
    return this.publishState('swing_horizontal_mode_state_topic', value);
  }
}
