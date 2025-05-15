from ha_mqtt_discoverable import Discoverable
from ha_mqtt_discoverable.sensors import BinarySensorInfo


class BinarySensor(Discoverable[BinarySensorInfo]):
    def off(self):
        """
        Set binary sensor to off
        """
        self.update_state(state=False)

    def on(self):
        """
        Set binary sensor to on
        """
        self.update_state(state=True)

    def update_state(self, state: bool) -> None:
        """
        Update MQTT sensor state

        Args:
            state(bool): What state to set the sensor to
        """
        state_message = self._entity.payload_on if state else self._entity.payload_off
        logger.info(f"Setting {self._entity.name} to {state_message} using {self.state_topic}")
        self._state_helper(state=state_message)

