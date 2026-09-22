import { TopicSubscriber } from '../topic-entity';
import { ValveInfo } from './valve-info';

export type ValveState = 'open' | 'closed' | 'opening' | 'closing';

/** Home Assistant MQTT valve entity. */
export class Valve extends TopicSubscriber<ValveInfo> {
  updateState(state: ValveState) {
    if (this.entity.reportsPosition && (state === 'open' || state === 'closed')) {
      return this.setPosition(
        state === 'open' ? (this.entity.positionOpen ?? 100) : (this.entity.positionClosed ?? 0),
      );
    }
    const payloads = {
      open: this.entity.stateOpen ?? 'open',
      closed: this.entity.stateClosed ?? 'closed',
      opening: this.entity.stateOpening ?? 'opening',
      closing: this.entity.stateClosing ?? 'closing',
    };
    return this.publishState('state_topic', payloads[state]);
  }
  setPosition(position: number) {
    if (!this.entity.reportsPosition)
      throw new Error('Enable reportsPosition to publish a valve position');
    const closed = this.entity.positionClosed ?? 0;
    const open = this.entity.positionOpen ?? 100;
    if (
      !Number.isFinite(position) ||
      position < Math.min(closed, open) ||
      position > Math.max(closed, open)
    ) {
      throw new RangeError('Valve position is outside the configured range');
    }
    return this.publishState('state_topic', position);
  }
}
