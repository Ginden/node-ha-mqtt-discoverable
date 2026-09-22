import { z } from 'zod';
import { TopicEntity, TopicSubscriber } from '../topic-entity';
import { InfraredEmitterInfo, InfraredReceiverInfo } from './infrared-info';

/** Alternating on/off timings in microseconds and optional carrier frequency in Hz. */
export interface InfraredSignal {
  timings: number[];
  modulation?: number | null;
}

export interface InfraredCommand extends InfraredSignal {
  repeat_count: number;
}

/** Receives Home Assistant's requests to transmit infrared signals. */
export class InfraredEmitter extends TopicSubscriber<InfraredEmitterInfo, InfraredCommand> {
  parseJson = true;

  protected get topicDefaults() {
    return { command_topic: 'command' };
  }
}

/** Reports captured infrared signals to Home Assistant without retaining old receptions. */
export class InfraredReceiver extends TopicEntity<InfraredReceiverInfo> {
  receive(signal: InfraredSignal) {
    z.object({
      timings: z.array(z.number().int()).min(1),
      modulation: z.number().int().nullable().optional(),
    }).parse(signal);
    return this.publishState('state_topic', JSON.stringify(signal), false);
  }
}
