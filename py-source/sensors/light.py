from ha_mqtt_discoverable import Subscriber
from ha_mqtt_discoverable.sensors import LightInfo


class Light(Subscriber[LightInfo]):
    """Implements an MQTT light.
    https://www.home-assistant.io/integrations/light.mqtt
    """

    def on(self) -> None:
        """
        Set light to on
        """
        state_payload = {
            "state": self._entity.payload_on,
        }
        self._update_state(state_payload)

    def off(self) -> None:
        """
        Set light to off
        """
        state_payload = {
            "state": self._entity.payload_off,
        }
        self._update_state(state_payload)

    def brightness(self, brightness: int) -> None:
        """
        Set brightness of the light

        Args:
            brightness(int): Brightness value of [0,255]
        """
        if brightness < 0 or brightness > 255:
            raise RuntimeError(f"Brightness for light {self._entity.name} is out of range")

        state_payload = {
            "brightness": brightness,
            "state": self._entity.payload_on,
        }

        self._update_state(state_payload)

    def color(self, color_mode: str, color: dict[str, Any]) -> None:
        """
        Set color of the light.
        NOTE: Make sure color formatting conforms to color mode, it is up to the caller to make sure
        of this. Also, make sure the color mode is in the list supported_color_modes

        Args:
            color_mode(str): A valid color mode
            color(Dict[str, Any]): Color to set, according to color_mode format
        """
        if not self._entity.color_mode:
            raise RuntimeError(f"Light {self._entity.name} does not support setting color")
        if color_mode not in self._entity.supported_color_modes:
            raise RuntimeError(f"Color is not in configured supported_color_modes {str(self._entity.supported_color_modes)}")
        # We do not check if color schema conforms to color mode formatting, it is up to the caller
        state_payload = {
            "color_mode": color_mode,
            "color": color,
            "state": self._entity.payload_on,
        }
        self._update_state(state_payload)

    def effect(self, effect: str) -> None:
        """
        Enable effect of the light

        Args:
            effect(str): Effect to apply
        """
        if not self._entity.effect:
            raise RuntimeError(f"Light {self._entity.name} does not support effects")
        if effect not in self._entity.effect_list:
            raise RuntimeError(f"Effect is not within configured effect_list {str(self._entity.effect_list)}")
        state_payload = {
            "effect": effect,
            "state": self._entity.payload_on,
        }
        self._update_state(state_payload)

    def _update_state(self, state: dict[str, Any]) -> None:
        """
        Update MQTT sensor state

        Args:
            state(Dict[str, Any]): What state to set the light to
        """
        logger.info(f"Setting {self._entity.name} to {state} using {self.state_topic}")
        json_state = json.dumps(state)
        self._state_helper(state=json_state, topic=self.state_topic, retain=self._entity.retain)
