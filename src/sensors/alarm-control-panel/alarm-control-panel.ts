import { TopicSubscriber } from '../topic-entity';
import { AlarmControlPanelInfo } from './alarm-control-panel-info';

export type AlarmState =
  | 'disarmed'
  | 'armed_home'
  | 'armed_away'
  | 'armed_night'
  | 'armed_vacation'
  | 'armed_custom_bypass'
  | 'pending'
  | 'arming'
  | 'disarming'
  | 'triggered';

/** Home Assistant MQTT alarm control panel entity. */
export class AlarmControlPanel extends TopicSubscriber<AlarmControlPanelInfo> {
  updateState(value: AlarmState) {
    return this.publishState('state_topic', value);
  }
}
