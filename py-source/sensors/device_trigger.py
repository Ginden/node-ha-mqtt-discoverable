from ha_mqtt_discoverable import Discoverable
from ha_mqtt_discoverable.sensors import DeviceTriggerInfo


class DeviceTrigger(Discoverable[DeviceTriggerInfo]):
    """Implements an MQTT Device Trigger
    https://www.home-assistant.io/integrations/device_trigger.mqtt/
    """

    def generate_config(self) -> dict[str, Any]:
        """Publish a custom configuration: since this entity does not provide a
        `state_topic`, HA expects a `topic` key in the config
        """
        config = super().generate_config()
        # Publish our `state_topic` as `topic`
        topics = {
            "topic": self.state_topic,
        }
        return config | topics

    def trigger(self, payload: Optional[str] = None):
        """
        Generate a device trigger event

        Args:
            payload: custom payload to send in the trigger topic

        """
        return self._state_helper(payload, self.state_topic, retain=False)
