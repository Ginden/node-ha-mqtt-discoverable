import { assert } from 'tsafe';
import { Subscriber } from '../../subscriber';
import { CoverInfo, CoverStateEnum } from './cover-info';

/**
 * Implements an MQTT cover for Home Assistant discovery
 */
export class Cover extends Subscriber<CoverInfo> {
  async setStatus(key: keyof CoverStateEnum) {
    assert(this.entity.stateEnum[key], `State ${key} is not defined`);
    return this.updateState(this.entity.stateEnum[key]);
  }

  /** Set the cover state to open */
  open() {
    return this.setStatus('open');
  }

  /** Set cover state to closed */
  closed() {
    return this.setStatus('closed');
  }

  /** Set cover state to closing */
  closing() {
    return this.setStatus('closing');
  }

  /** Set cover state to opening */
  opening() {
    return this.setStatus('opening');
  }

  /** Set cover state to stopped */
  stopped() {
    return this.setStatus('stopped');
  }

  private updateState(state: string) {
    return this._state_helper(state, this.stateTopic, undefined, this.entity.retain);
  }
}
