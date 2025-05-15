from ha_mqtt_discoverable import Subscriber
from ha_mqtt_discoverable.sensors import CoverInfo


class Cover(Subscriber[CoverInfo]):
    """Implements an MQTT cover:
    https://www.home-assistant.io/integrations/cover.mqtt
    """

    def open(self) -> None:
        """Set cover state to open"""
        self._update_state(self._entity.state_open)

    def closed(self) -> None:
        """Set cover state to closed"""
        self._update_state(self._entity.state_closed)

    def closing(self) -> None:
        """Set cover state to closing"""
        self._update_state(self._entity.state_closing)

    def opening(self) -> None:
        """Set cover state to opening"""
        self._update_state(self._entity.state_opening)

    def stopped(self) -> None:
        """Set cover state to stopped"""
        self._update_state(self._entity.state_stopped)

    def _update_state(self, state: str) -> None:
        """
        Update MQTT sensor state

        Args:
            state(str): What state to set the cover to
        """
        print("State: " + state)
        logger.info(f"Setting {self._entity.name} to {state} using {self.state_topic}")
        self._state_helper(state=state, topic=self.state_topic, retain=self._entity.retain)
