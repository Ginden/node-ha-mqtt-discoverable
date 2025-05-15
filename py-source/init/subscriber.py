class Subscriber(Discoverable[EntityType]):
    """
    Specialized sub-lass that listens to commands coming from an MQTT topic
    """

    T = TypeVar("T")  # Used in the callback function

    def __init__(
            self,
            settings: Settings[EntityType],
            command_callback: Callable[[mqtt.Client, T, mqtt.MQTTMessage], Any],
            user_data: T = None,
    ) -> None:
        """
        Entity that listens to commands from an MQTT topic.

        Args:
            settings: Settings for the entity we want to create in Home Assistant.
            See the `Settings` class for the available options.
            command_callback: Callback function invoked when there is a command
            coming from the MQTT command topic
        """

        # Callback invoked when the MQTT connection is established
        def on_client_connected(client: mqtt.Client, *args):
            # Publish this button in Home Assistant
            # Subscribe to the command topic
            result, _ = client.subscribe(self._command_topic, qos=1)
            if result is not mqtt.MQTT_ERR_SUCCESS:
                raise RuntimeError("Error subscribing to MQTT command topic")

        # Invoke the parent init
        super().__init__(settings, on_client_connected)
        # Define the command topic to receive commands from HA, using `hmd` topic prefix
        self._command_topic = f"{self._settings.mqtt.state_prefix}/{self._entity_topic}/command"

        # Register the user-supplied callback function with its user_data
        self.mqtt_client.user_data_set(user_data)
        self.mqtt_client.on_message = command_callback

        # Manually connect the MQTT client
        self._connect_client()

    def generate_config(self) -> dict[str, Any]:
        """Override base config to add the command topic of this switch"""
        config = super().generate_config()
        # Add the MQTT command topic to the existing config object
        topics = {
            "command_topic": self._command_topic,
        }
        return config | topics
