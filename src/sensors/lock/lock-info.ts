import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/lock.mqtt/ */
export class LockInfo extends EntityInfo {
  @Validate(z.literal('lock'))
  readonly component = 'lock';

  @Validate(z.string().optional())
  codeFormat?: string;

  @Validate(z.string().optional())
  commandTemplate?: string;

  @Validate(z.string().optional())
  commandTopic?: string;

  @Validate(z.boolean().optional())
  optimistic?: boolean;

  @Validate(z.string().optional())
  payloadLock?: string;

  @Validate(z.string().optional())
  payloadUnlock?: string;

  @Validate(z.string().optional())
  payloadOpen?: string;

  @Validate(z.string().optional())
  payloadReset?: string;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  stateJammed?: string;

  @Validate(z.string().optional())
  stateLocked?: string;

  @Validate(z.string().optional())
  stateLocking?: string;

  @Validate(z.string().optional())
  stateTopic?: string;

  @Validate(z.string().optional())
  stateUnlocked?: string;

  @Validate(z.string().optional())
  stateUnlocking?: string;

  @Validate(z.string().optional())
  valueTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  @Validate(z.string().optional())
  stateOpen?: string;

  @Validate(z.string().optional())
  stateOpening?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      stateOpen: 'state_open',
      stateOpening: 'state_opening',
      codeFormat: 'code_format',
      commandTemplate: 'command_template',
      commandTopic: 'command_topic',
      optimistic: 'optimistic',
      payloadLock: 'payload_lock',
      payloadUnlock: 'payload_unlock',
      payloadOpen: 'payload_open',
      payloadReset: 'payload_reset',
      retain: 'retain',
      stateJammed: 'state_jammed',
      stateLocked: 'state_locked',
      stateLocking: 'state_locking',
      stateTopic: 'state_topic',
      stateUnlocked: 'state_unlocked',
      stateUnlocking: 'state_unlocking',
      valueTemplate: 'value_template',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<LockInfo>;
  }
}
