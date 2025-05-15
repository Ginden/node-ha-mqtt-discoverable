from ha_mqtt_discoverable import EntityInfo


class ButtonInfo(EntityInfo):
    """Button specific information"""

    component: str = "button"

    payload_press: str = "PRESS"
    """The payload to send to trigger the button."""
    retain: Optional[bool] = None
    """If the published message should have the retain flag on or not"""
