import { assert } from 'tsafe';
import { Subscriber } from '../../subscriber';
import { FanDirection, FanInfo } from './fan-info';

/** Implements an MQTT fan for Home Assistant discovery. */
export class Fan extends Subscriber<FanInfo, string | number> {
  /** Set the fan to its running state. */
  switchOn() {
    return this.updateState(this.entity.payloadOn);
  }

  /** Set the fan to its stopped state. */
  switchOff() {
    return this.updateState(this.entity.payloadOff);
  }

  /** Publish the current direction. */
  setDirection(direction: FanDirection) {
    return this.updateAuxiliaryState(direction, this.entity.directionStateTopic, 'direction');
  }

  /** Publish whether oscillation is enabled. */
  setOscillation(enabled: boolean) {
    return this.updateAuxiliaryState(
      enabled ? this.entity.payloadOscillationOn : this.entity.payloadOscillationOff,
      this.entity.oscillationStateTopic,
      'oscillation',
    );
  }

  /** Publish the device speed within its configured speed range. */
  setPercentage(percentage: number) {
    if (percentage < this.entity.speedRangeMin || percentage > this.entity.speedRangeMax) {
      const range = `[${this.entity.speedRangeMin}, ${this.entity.speedRangeMax}]`;
      throw new RangeError(`Fan percentage is not within configured speed range ${range}`);
    }
    return this.updateAuxiliaryState(percentage, this.entity.percentageStateTopic, 'percentage');
  }

  /** Publish the active preset mode. */
  setPresetMode(presetMode: string) {
    if (!this.entity.presetModes?.includes(presetMode)) {
      throw new RangeError(
        `Preset mode ${presetMode} is not configured for fan ${this.entity.name}`,
      );
    }
    return this.updateAuxiliaryState(presetMode, this.entity.presetModeStateTopic, 'preset mode');
  }

  /** Publish the on/off state to the fan state topic. */
  updateState(state: string) {
    return this._state_helper(state, this.stateTopic, undefined, this.entity.retain);
  }

  async subscribe() {
    await super.subscribe();
    for (const topic of this.auxiliaryCommandTopics()) {
      this.settings.addCommandCallback(topic, this);
      await this.mqtt.subscribeAsync(topic, { qos: 1 });
    }
  }

  private auxiliaryCommandTopics() {
    return [
      this.entity.directionCommandTopic,
      this.entity.oscillationCommandTopic,
      this.entity.percentageCommandTopic,
      this.entity.presetModeCommandTopic,
    ].filter((topic): topic is string => topic !== undefined && topic !== this.commandTopic);
  }

  private updateAuxiliaryState(state: string | number, topic: string | undefined, feature: string) {
    assert(topic, `The ${feature} state topic is not configured for fan ${this.entity.name}`);
    return this._state_helper(state, topic, undefined, this.entity.retain);
  }
}
