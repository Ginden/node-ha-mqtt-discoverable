class CameraInfo(EntityInfo):
    """
    Information about the 'camera' entity.
    """

    component: str = "camera"
    """The component type is 'camera' for this entity."""
    availability_topic: Optional[str] = None
    """The MQTT topic subscribed to publish the camera availability."""
    payload_available: Optional[str] = "online"
    """Payload to publish to indicate the camera is online."""
    payload_not_available: Optional[str] = "offline"
    """Payload to publish to indicate the camera is offline."""
    topic: Optional[str] = None
    """
    The MQTT topic to subscribe to receive an image URL. A url_template option can extract the URL from the message.
    The content_type will be derived from the image when downloaded.
    """
    retain: Optional[bool] = None
    """If the published message should have the retain flag on or not."""
