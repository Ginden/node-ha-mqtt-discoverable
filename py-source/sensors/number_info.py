from ha_mqtt_discoverable import EntityInfo


class NumberInfo(EntityInfo):
    """Information about the 'number' entity"""

    component: str = "number"

    max: float | int = 100
    """The maximum value of the number (defaults to 100)"""
    min: float | int = 1
    """The maximum value of the number (defaults to 1)"""
    mode: Optional[str] = None
    """Control how the number should be displayed in the UI. Can be set to box
    or slider to force a display mode."""
    optimistic: Optional[bool] = None
    """Flag that defines if switch works in optimistic mode.
    Default: true if no state_topic defined, else false."""
    payload_reset: Optional[str] = None
    """A special payload that resets the state to None when received on the
    state_topic."""
    retain: Optional[bool] = None
    """If the published message should have the retain flag on or not"""
    state_topic: Optional[str] = None
    """The MQTT topic subscribed to receive state updates."""
    step: Optional[float] = None
    """Step value. Smallest acceptable value is 0.001. Defaults to 1.0."""
    unit_of_measurement: Optional[str] = None
    """Defines the unit of measurement of the sensor, if any. The
    unit_of_measurement can be null."""
