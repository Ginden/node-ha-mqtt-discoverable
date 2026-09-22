import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/valve.mqtt/ */
export class ValveInfo extends EntityInfo {
  static wholeValidation(obj: ValveInfo) {
    super.wholeValidation(obj);
    if (
      obj.reportsPosition &&
      [obj.payloadOpen, obj.payloadClose, obj.stateOpen, obj.stateClosed].some(
        (value) => value !== undefined,
      )
    ) {
      throw new Error(
        'Position-reporting valves cannot configure open/close state or command payloads',
      );
    }
    if ((obj.positionOpen ?? 100) === (obj.positionClosed ?? 0))
      throw new RangeError('Valve open and closed positions must differ');
  }

  @Validate(z.literal('valve'))
  readonly component = 'valve';

  @Validate(z.string().optional())
  commandTemplate?: string;

  @Validate(z.string().optional())
  commandTopic?: string;

  @Validate(z.boolean().optional())
  optimistic?: boolean;

  @Validate(z.string().optional())
  payloadClose?: string;

  @Validate(z.string().optional())
  payloadOpen?: string;

  @Validate(z.string().optional())
  payloadStop?: string;

  @Validate(z.number().int().optional())
  positionClosed?: number;

  @Validate(z.number().int().optional())
  positionOpen?: number;

  @Validate(z.boolean().optional())
  reportsPosition?: boolean;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  stateClosed?: string;

  @Validate(z.string().optional())
  stateClosing?: string;

  @Validate(z.string().optional())
  stateOpen?: string;

  @Validate(z.string().optional())
  stateOpening?: string;

  @Validate(z.string().optional())
  stateTopic?: string;

  @Validate(z.string().optional())
  valueTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      commandTemplate: 'command_template',
      commandTopic: 'command_topic',
      optimistic: 'optimistic',
      payloadClose: 'payload_close',
      payloadOpen: 'payload_open',
      payloadStop: 'payload_stop',
      positionClosed: 'position_closed',
      positionOpen: 'position_open',
      reportsPosition: 'reports_position',
      retain: 'retain',
      stateClosed: 'state_closed',
      stateClosing: 'state_closing',
      stateOpen: 'state_open',
      stateOpening: 'state_opening',
      stateTopic: 'state_topic',
      valueTemplate: 'value_template',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<ValveInfo>;
  }
}
