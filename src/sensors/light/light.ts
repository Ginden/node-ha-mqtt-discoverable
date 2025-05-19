import { Subscriber } from '../../subscriber';
import type { ColorMode } from '../../types';
import { ColorModeSelector, colorModeValidator } from '../../types/color-mode-validator';
import { LightState } from './light-state';
import { LightInfo } from './light-info';

/**
 * Implements an MQTT light for Home Assistant discovery
 */
export class Light extends Subscriber<LightInfo, LightState, Light> {
  /** Set light to on */
  async switchOn() {
    return await this.updateState({ state: this.entity.payloadOn });
  }

  /** Set light to off */
  async switchOff() {
    return await this.updateState({ state: this.entity.payloadOff });
  }

  /** Set brightness of the light */
  brightness(level: number) {
    if (level < 0 || level > 255)
      throw RangeError(`Brightness for light ${this.entity.name} is out of range`);

    return this.updateState({ state: this.entity.payloadOn, brightness: level });
  }

  /** Set the color of the light */
  color<GivenColorMode extends ColorMode>(
    colorMode: GivenColorMode,
    color: ColorModeSelector[GivenColorMode],
  ) {
    if (!this.entity.supportedColorModes?.includes(colorMode)) {
      throw RangeError(`Color mode ${colorMode} is not supported by light ${this.entity.name}`);
    }

    if (!this.entity.colorMode) {
      throw Error(`Color mode is not supported by light ${this.entity.name}`);
    }

    if (!colorModeValidator(colorMode, color)) {
      throw TypeError(`Color mode ${colorMode} is not valid for light ${this.entity.name}`);
    }

    const payload = {
      color_mode: colorMode,
      state: this.entity.payloadOn,
      color: color,
    };

    return this.updateState(payload);
  }

  /** Enable an effect of the light */
  effect(effect: string) {
    if (!this.entity.effect) {
      throw Error(`Effect is not supported by light ${this.entity.name}`);
    }
    if (!this.entity.effectList?.includes(effect)) {
      throw Error(
        `Effect ${effect} is not within configured effect_list ${JSON.stringify(this.entity.effectList)}`,
      );
    }
    return this.updateState({
      effect: effect,
      state: this.entity.payloadOn,
    });
  }

  /**
   * Publishes the state of the light to the state topic
   * @param state
   */
  updateState(state: LightState) {
    return this._state_helper(
      JSON.stringify(state),
      this.stateTopic,
      undefined,
      this.entity.retain,
    );
  }
}
