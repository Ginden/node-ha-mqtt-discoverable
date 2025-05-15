from ha_mqtt_discoverable import CONFIGURATION_KEY_NAMES


def valid_configuration_key(name: str) -> bool:
    """
    Confirm that a configuration key is in the allowed list
    """
    return name in CONFIGURATION_KEY_NAMES
