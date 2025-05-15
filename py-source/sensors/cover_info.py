from ha_mqtt_discoverable import EntityInfo


class CoverInfo(EntityInfo):
    """Cover specific information"""

    component: str = "cover"

    optimistic: Optional[bool] = None
    """Flag that defines if light works in optimistic mode.
    Default: true if no state_topic defined, else false."""
    payload_close: str = "CLOSE"
    """Command payload to close the cover"""
    payload_open: str = "OPEN"
    """Command payload to open the cover"""
    payload_stop: str = "STOP"
    """Command payload to open the cover"""
    position_closed: int = 0
    """Number which represents the fully closed position"""
    position_open: int = 100
    """Number which represents the fully open position"""
    state_open: str = "open"
    """Payload that represents open state"""
    state_opening: str = "opening"
    """Payload that represents opening state"""
    state_closed: str = "closed"
    """Payload that represents closed state"""
    state_closing: str = "closing"
    """Payload that represents closing state"""
    state_stopped: str = "stopped"
    """Payload that represents stopped state"""
    state_topic: Optional[str] = None
    """The MQTT topic subscribed to receive state updates."""
    retain: Optional[bool] = True
    """If the published message should have the retain flag on or not"""
