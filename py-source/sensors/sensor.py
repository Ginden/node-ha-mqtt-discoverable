from ha_mqtt_discoverable import Discoverable
from ha_mqtt_discoverable.sensors import SensorInfo


class Sensor(Discoverable[SensorInfo]):
    def set_state(self, state: str | int | float, last_reset: str = None) -> None:
        """
        Update the sensor state

        Args:
            state(str): What state to set the sensor to
            last_reset(str): ISO 8601-formatted string when an accumulating sensor was initialized
        """
        logger.info(f"Setting {self._entity.name} to {state} using {self.state_topic}")
        if last_reset:
            logger.info("Setting last_reset to " + last_reset)
        self._state_helper(str(state), last_reset=last_reset)
