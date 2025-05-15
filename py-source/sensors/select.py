from ha_mqtt_discoverable import Subscriber
from ha_mqtt_discoverable.sensors import SelectInfo


class Select(Subscriber[SelectInfo]):
    """
    Implements an MQTT select for Home Assistant MQTT discovery:
    https://www.home-assistant.io/integrations/select.mqtt/
    """

    def set_options(self, opt: list) -> None:
        """
        Update the selectable options.

        Args:
            opt (list): List of options that can be selected.
        """
        if not opt:
            raise RuntimeError("Image URL cannot be empty")

        logger.info(f"Publishing options {opt} to {self._entity.options}")
        self._state_helper(opt)
