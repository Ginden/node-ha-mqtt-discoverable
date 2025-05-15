from ha_mqtt_discoverable import EntityInfo


class SelectInfo(EntityInfo):
    """Switch specific information"""

    component: str = "select"
    optimistic: Optional[bool] = None
    """Flag that defines if switch works in optimistic mode.
    Default: true if no state_topic defined, else false."""
    retain: Optional[bool] = None
    """If the published message should have the retain flag on or not"""
    state_topic: Optional[str] = None
    """The MQTT topic subscribed to receive state updates."""
    options: Optional[list] = None
    """List of options that can be selected. An empty list or a list with a single item is allowed."""

