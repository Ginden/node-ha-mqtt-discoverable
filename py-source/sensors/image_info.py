from ha_mqtt_discoverable import EntityInfo


class ImageInfo(EntityInfo):
    """
    Information about the 'image' entity.
    """

    component: str = "image"
    """The component type is 'image' for this entity."""
    availability_topic: Optional[str] = None
    """The MQTT topic subscribed to publish the image availability."""
    payload_available: Optional[str] = "online"
    """Payload to publish to indicate the image is online."""
    payload_not_available: Optional[str] = "offline"
    """Payload to publish to indicate the image is offline."""
    url_topic: Optional[str] = None
    """
    The MQTT topic to subscribe to receive an image URL. A url_template option can extract the URL from the message.
    The content_type will be derived from the image when downloaded.
    """
    retain: Optional[bool] = None
    """If the published message should have the retain flag on or not."""
