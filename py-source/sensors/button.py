from ha_mqtt_discoverable import Subscriber
from ha_mqtt_discoverable.sensors import ButtonInfo


class Button(Subscriber[ButtonInfo]):
    """Implements an MQTT button:
    https://www.home-assistant.io/integrations/button.mqtt
    """

