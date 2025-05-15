import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { Validate } from '../../validate';
import { PropertyMap } from '../../types/property-map';

export type CoverStateEnum = {
  open: string;
  opening: string;
  closed: string;
  closing: string;
  stopped: string;
};

/**
 * Cover specific information
 */
export class CoverInfo extends EntityInfo {
  @Validate(z.literal('cover'))
  readonly component = 'cover';

  /**
   * Flag that defines if light works in optimistic mode.
   * Default: true if no state_topic defined, else false.
   */
  @Validate(z.boolean().optional())
  optimistic?: boolean;

  /** Command payload to close the cover */
  @Validate(z.string().optional())
  readonly payloadClose = 'CLOSE';

  /** Command payload to open the cover */
  @Validate(z.string().optional())
  payloadOpen = 'OPEN';

  /** Command payload to stop the cover */
  @Validate(z.string().optional())
  payloadStop = 'STOP';

  /** Number which represents the fully closed position */
  @Validate(z.number().int().optional())
  positionClosed = 0;

  /** Number which represents the fully open position */
  @Validate(z.number().int().optional())
  positionOpen = 100;

  /** Payload that represents open state */
  @Validate(z.string().optional())
  stateOpen = 'open';

  /** Payload that represents opening state */
  @Validate(z.string().optional())
  stateOpening = 'opening';

  /** Payload that represents a closed state */
  @Validate(z.string().optional())
  stateClosed = 'closed';

  /** Payload that represents closing state */
  @Validate(z.string().optional())
  stateClosing: string = 'closing';

  /** Payload that represents stopped state */
  @Validate(z.string().optional())
  stateStopped: string = 'stopped';

  /** The MQTT topic subscribed to receive state updates. */
  @Validate(z.string().optional())
  stateTopic?: string;

  /** If the published message should have the retain flag on or not */
  @Validate(z.boolean().optional())
  retain?: boolean;

  get stateEnum(): CoverStateEnum {
    return {
      open: this.stateOpen,
      opening: this.stateOpening,
      closed: this.stateClosed,
      closing: this.stateClosing,
      stopped: this.stateStopped,
    };
  }

  /**
   * Mapping of class properties to MQTT payload keys.
   */
  protected propertyMap() {
    return {
      ...super.propertyMap(),
      component: 'component',
      optimistic: 'optimistic',
      payloadClose: 'payload_close',
      payloadOpen: 'payload_open',
      payloadStop: 'payload_stop',
      positionClosed: 'position_closed',
      positionOpen: 'position_open',
      stateOpen: 'state_open',
      stateOpening: 'state_opening',
      stateClosed: 'state_closed',
      stateClosing: 'state_closing',
      stateStopped: 'state_stopped',
      stateTopic: 'state_topic',
      retain: 'retain',
    } as const satisfies PropertyMap<CoverInfo, 'stateEnum'>;
  }
}
