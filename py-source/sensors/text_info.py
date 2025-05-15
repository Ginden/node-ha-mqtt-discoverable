from ha_mqtt_discoverable import EntityInfo


class TextInfo(EntityInfo):
    """Information about the `text` entity"""

    component: str = "text"

    max: int = 255
    """The maximum size of a text being set or received (maximum is 255)."""
    min: int = 0
    """The minimum size of a text being set or received."""
    mode: Optional[str] = "text"
    """The mode off the text entity. Must be either text or password."""
    pattern: Optional[str] = None
    """A valid regular expression the text being set or received must match with."""

    retain: Optional[bool] = None
    """If the published message should have the retain flag on or not"""
