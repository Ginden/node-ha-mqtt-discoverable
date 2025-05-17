import { Validate } from '../../validate';
import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { ColorMode } from '../../types/color-mode';
import { PropertyMap } from '../../types/property-map';

/**
 * Light specific information
 */
export class LightInfo extends EntityInfo {
  @Validate(z.literal('light'))
  readonly component = 'light';

  /**
   * Sets the schema of the state topic, ie the 'schema' field in the configuration
   */
  @Validate(z.any(/* TODO: Field(default="json", alias="schema") */))
  stateSchema: string = 'json';

  /**
   * Flag that defines if light works in optimistic mode.
   * Default: true if no state_topic defined, else false.
   */
  @Validate(z.boolean())
  optimistic?: boolean;

  /**
   * The payload that represents off state. If specified, will be used for
   * both comparing to the value in the state_topic (see value_template and
   * state_off for details) and sending as off command to the command_topic
   */
  @Validate(z.string())
  payloadOff = 'OFF';

  /**
   * The payload that represents on state. If specified, will be used for both
   * comparing to the value in the state_topic (see value_template and state_on
   * for details) and sending as on command to the command_topic.
   */
  @Validate(z.string())
  payloadOn = 'ON';

  /**
   * Flag that defines if the light supports setting the brightness
   * BUG: This seems to be ignored by Home Assistant
   */
  @Validate(z.boolean().optional())
  brightness?: boolean;

  /**
   * Flag that defines if the light supports color mode
   */
  @Validate(z.boolean().optional())
  colorMode?: boolean;

  /**
   * List of supported color modes. See
   * https://www.home-assistant.io/integrations/light.mqtt/#supported_color_modes for current list of
   * supported modes. Required if color_mode is set
   */
  @Validate(z.array(z.nativeEnum(ColorMode)).optional())
  supportedColorModes?: ColorMode[];

  /**
   * Flag that defines if the light supports effects
   */
  @Validate(z.boolean().optional())
  effect?: boolean;

  /**
   * List of supported effects. Required if effect is set
   */
  @Validate(z.array(z.string()).optional())
  effectList?: string[];

  /**
   * If the published message should have the retain flag on or not
   */
  @Validate(z.boolean().optional())
  retain?: boolean;

  /**
   * The MQTT topic subscribed to receive state updates.
   */
  @Validate(z.string().optional())
  stateTopic?: string;

  /**
   * Mapping of class properties to MQTT payload keys.
   */
  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      stateSchema: 'schema',
      optimistic: 'optimistic',
      payloadOff: 'payload_off',
      payloadOn: 'payload_on',
      brightness: 'brightness',
      colorMode: 'color_mode',
      supportedColorModes: 'supported_color_modes',
      effect: 'effect',
      effectList: 'effect_list',
      retain: 'retain',
      stateTopic: 'state_topic',
    } as const satisfies PropertyMap<LightInfo>;
  }
}
