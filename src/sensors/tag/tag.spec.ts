import { expect, test } from 'vitest';
import { TagScanner, TagScannerInfo } from '../index';
import { mqttTestContext } from '../../testing/mqtt-client';

test('discovers a scanner with topic and publishes scans without retention', async () => {
  const { client, manager } = mqttTestContext();
  const scanner = new TagScanner(
    TagScannerInfo.create({ name: 'Reader', topic: 'reader/tags' }),
    manager,
  );
  await scanner.scan('04-A1-B2');
  expect(scanner.generateConfig()).toEqual({ topic: 'reader/tags' });
  expect(client.publishAsync).toHaveBeenCalledWith(
    'homeassistant/tag/Reader/config',
    '{"topic":"reader/tags"}',
    expect.objectContaining({ retain: true }),
  );
  expect(client.publishAsync).toHaveBeenLastCalledWith('reader/tags', '04-A1-B2', {
    retain: false,
  });
});
