import { MessageCallback } from '../../settings/message-callback';
import { Subscriber } from '../../subscriber';
import { ButtonInfo } from './button-info';
import { HaDiscoverableManager } from '../../settings';
import { wrapCallbackWithNoParse } from '../../utils/wrap-callback-with-no-parse';

/**
 * Implements an MQTT button for Home Assistant discovery
 */
export class Button extends Subscriber<ButtonInfo, 'PRESS'> {
  constructor(
    entityInfo: ButtonInfo,
    settings: HaDiscoverableManager,
    pressCallback: MessageCallback<'PRESS', Button, ButtonInfo>,
  ) {
    super(
      entityInfo,
      settings,
      wrapCallbackWithNoParse(pressCallback as unknown as MessageCallback),
    );
  }
}
