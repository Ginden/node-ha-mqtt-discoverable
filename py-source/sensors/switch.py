# Inherit the on and off methods from the BinarySensor class, changing only the
# documentation string
from ha_mqtt_discoverable import Subscriber
from ha_mqtt_discoverable.sensors import SwitchInfo, BinarySensor


class Switch(Subscriber[SwitchInfo], BinarySensor):
    """Implements an MQTT switch:
    https://www.home-assistant.io/integrations/switch.mqtt
    """

    def off(self):
        """
        Set switch to off
        """
        super().off()

    def on(self):
        """
        Set switch to on
        """
        super().on()
