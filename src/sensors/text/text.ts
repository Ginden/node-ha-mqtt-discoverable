import { Subscriber } from '../../subscriber';
import { TextInfo } from './text-info';

/**
 * Implements an MQTT text for Home Assistant discovery
 */
export class Text extends Subscriber<TextInfo> {
  /** Update the text displayed by this sensor */
  setText(text: string) {
    return this._state_helper(text);
  }
}
