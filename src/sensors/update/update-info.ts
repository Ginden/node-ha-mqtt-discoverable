import { z } from 'zod';
import { EntityInfo } from '../../entity-info';
import { PropertyMap } from '../../types/property-map';
import { Validate } from '../../validate';

/** MQTT discovery options. @see https://www.home-assistant.io/integrations/update.mqtt/ */
export class UpdateInfo extends EntityInfo {
  @Validate(z.literal('update'))
  readonly component = 'update';

  @Validate(z.string().optional())
  commandTopic?: string;

  @Validate(z.number().int().optional())
  displayPrecision?: number;

  @Validate(z.string().optional())
  latestVersionTemplate?: string;

  @Validate(z.string().optional())
  latestVersionTopic?: string;

  @Validate(z.string().optional())
  payloadInstall?: string;

  @Validate(z.string().optional())
  releaseSummary?: string;

  @Validate(z.string().optional())
  releaseUrl?: string;

  @Validate(z.boolean().optional())
  retain?: boolean;

  @Validate(z.string().optional())
  stateTopic?: string;

  @Validate(z.string().optional())
  title?: string;

  @Validate(z.string().optional())
  valueTemplate?: string;

  @Validate(z.string().optional())
  installedVersion?: string;

  @Validate(z.string().optional())
  latestVersion?: string;

  @Validate(z.boolean().optional())
  inProgress?: boolean;

  @Validate(z.string().optional())
  updatePercentage?: string;

  @Validate(z.string().optional())
  jsonAttributesTemplate?: string;

  @Validate(z.string().optional())
  jsonAttributesTopic?: string;

  protected propertyMap() {
    return {
      ...super.propertyMap(),
      commandTopic: 'command_topic',
      displayPrecision: 'display_precision',
      latestVersionTemplate: 'latest_version_template',
      latestVersionTopic: 'latest_version_topic',
      payloadInstall: 'payload_install',
      releaseSummary: 'release_summary',
      releaseUrl: 'release_url',
      retain: 'retain',
      stateTopic: 'state_topic',
      title: 'title',
      valueTemplate: 'value_template',
      installedVersion: 'installed_version',
      latestVersion: 'latest_version',
      inProgress: 'in_progress',
      updatePercentage: 'update_percentage',
      jsonAttributesTemplate: 'json_attributes_template',
      jsonAttributesTopic: 'json_attributes_topic',
    } as const satisfies PropertyMap<UpdateInfo>;
  }
}
