import { TopicSubscriber } from '../topic-entity';
import { WaterHeaterInfo } from './water-heater-info';

/** Home Assistant MQTT water heater entity. */
export class WaterHeater extends TopicSubscriber<WaterHeaterInfo> {
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
    return ['mode_command_topic', 'power_command_topic', 'temperature_command_topic'];
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
}
