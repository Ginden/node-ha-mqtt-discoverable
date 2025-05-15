from ha_mqtt_discoverable import Subscriber
from ha_mqtt_discoverable.sensors import TextInfo


class Text(Subscriber[TextInfo]):
    """Implements an MQTT text:
    https://www.home-assistant.io/integrations/text.mqtt/
    """

    def set_text(self, text: str) -> None:
        """
        Update the text displayed by this sensor. Check that it is of acceptable length.

        Args:
            text(str): Value of the text configured for this entity
        """
        if not self._entity.min <= len(text) <= self._entity.max:
            bound = f"[{self._entity.min}, {self._entity.max}]"
            raise RuntimeError(f"Text is not within configured length boundaries {bound}")

        logger.info(f"Setting {self._entity.name} to {text} using {self.state_topic}")
        self._state_helper(str(text))
