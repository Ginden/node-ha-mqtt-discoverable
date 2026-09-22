import { TopicSubscriber } from '../topic-entity';
import { LockInfo } from './lock-info';

export type LockState =
  | 'locked'
  | 'unlocked'
  | 'locking'
  | 'unlocking'
  | 'jammed'
  | 'open'
  | 'opening';

/** Home Assistant MQTT lock entity. */
export class Lock extends TopicSubscriber<LockInfo> {
  updateState(state: LockState) {
    const payloads = {
      locked: this.entity.stateLocked ?? 'LOCKED',
      unlocked: this.entity.stateUnlocked ?? 'UNLOCKED',
      locking: this.entity.stateLocking ?? 'LOCKING',
      unlocking: this.entity.stateUnlocking ?? 'UNLOCKING',
      jammed: this.entity.stateJammed ?? 'JAMMED',
      open: this.entity.stateOpen ?? 'OPEN',
      opening: this.entity.stateOpening ?? 'OPENING',
    };
    return this.publishState('state_topic', payloads[state]);
  }
  locked() {
    return this.updateState('locked');
  }
  unlocked() {
    return this.updateState('unlocked');
  }
}
