from ha_mqtt_discoverable import Subscriber
from ha_mqtt_discoverable.sensors import NumberInfo


class Number(Subscriber[NumberInfo]):
    """Implements an MQTT number:
    https://www.home-assistant.io/integrations/number.mqtt/
    """

    def set_value(self, value: float) -> None:
        """
        Update the numeric value. Raises an error if not within the acceptable range.

        Args:
            value(str): Value of the number configured for this entity
        """
        if not self._entity.min <= value <= self._entity.max:
            bound = f"[{self._entity.min}, {self._entity.max}]"
            raise RuntimeError(f"Value is not within configured boundaries {bound}")

        logger.info(f"Setting {self._entity.name} to {value} using {self.state_topic}")
        self._state_helper(value)
