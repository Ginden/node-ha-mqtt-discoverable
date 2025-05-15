class Discoverable(Generic[EntityType]):
    """
    Base class for making MQTT discoverable objects
    """

    _settings: Settings
    _entity: EntityType

    mqtt_client: mqtt.Client
    wrote_configuration: bool = False
    # MQTT topics
    _entity_topic: str
    config_topic: str
    state_topic: str
    availability_topic: str
    attributes_topic: str

    def __init__(self, settings: Settings[EntityType], on_connect: Optional[Callable] = None) -> None:
        """
        Creates a basic discoverable object.

        Args:
            settings: Settings for the entity we want to create in Home Assistant.
            See the `Settings` class for the available options.
            on_connect: Optional callback function invoked when the MQTT client \
                successfully connects to the broker.
            If defined, you need to call `_connect_client()` to establish the \
                connection manually.
        """
        # Import here to avoid circular dependency on imports
        # TODO how to better handle this?
        from ha_mqtt_discoverable.utils import clean_string

        self._settings = settings
        self._entity = settings.entity

        # Build the topic string: start from the type of component
        # e.g. `binary_sensor`
        self._entity_topic = f"{self._entity.component}"
        # If present, append the device name, e.g. `binary_sensor/mydevice`
        self._entity_topic += f"/{clean_string(self._entity.device.name)}" if self._entity.device else ""
        # Append the sensor name, e.g. `binary_sensor/mydevice/mysensor`
        self._entity_topic += f"/{clean_string(self._entity.name)}"

        # Full topic where we publish the configuration message to be picked up by HA
        # Prepend the `discovery_prefix`, default: `homeassistant`
        # e.g. homeassistant/binary_sensor/mydevice/mysensor
        self.config_topic = f"{self._settings.mqtt.discovery_prefix}/{self._entity_topic}/config"
        # Full topic where we publish our own state messages
        # Prepend the `state_prefix`, default: `hmd`
        # e.g. hmd/binary_sensor/mydevice/mysensor
        self.state_topic = f"{self._settings.mqtt.state_prefix}/{self._entity_topic}/state"

        # Full topic where we publish our own attributes as JSON messages
        # Prepend the `state_prefix`, default: `hmd`
        # e.g. hmd/binary_sensor/mydevice/mysensor
        self.attributes_topic = f"{self._settings.mqtt.state_prefix}/{self._entity_topic}/attributes"

        logger.info(f"config_topic: {self.config_topic}")
        logger.info(f"state_topic: {self.state_topic}")
        if self._settings.manual_availability:
            # Define the availability topic, using `hmd` topic prefix
            self.availability_topic = f"{self._settings.mqtt.state_prefix}/{self._entity_topic}/availability"
            logger.debug(f"availability_topic: {self.availability_topic}")

        # Create the MQTT client, registering the user `on_connect` callback
        self._setup_client(on_connect)
        # If there is a callback function defined, the user must manually connect
        # to the MQTT client
        if not (on_connect or self._settings.mqtt.client is not None):
            self._connect_client()

    def __str__(self) -> str:
        """
        Generate a string representation of the Discoverable object
        """
        dump = f"""
settings: {self._settings}
topic_prefix: {self._entity_topic}
config_topic: {self.config_topic}
state_topic: {self.state_topic}
wrote_configuration: {self.wrote_configuration}
        """
        return dump

    def _setup_client(self, on_connect: Optional[Callable] = None) -> None:
        """Create an MQTT client and setup some basic properties on it"""

        # If the user has passed in an MQTT client, use it
        if self._settings.mqtt.client:
            self.mqtt_client = self._settings.mqtt.client
            return

        mqtt_settings = self._settings.mqtt
        logger.debug(f"Creating mqtt client ({mqtt_settings.client_name}) for {mqtt_settings.host}:{mqtt_settings.port}")
        self.mqtt_client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2, client_id=mqtt_settings.client_name)
        if mqtt_settings.tls_key:
            logger.info(f"Connecting to {mqtt_settings.host}:{mqtt_settings.port} with SSL and client certificate authentication")
            logger.debug(f"ca_certs={mqtt_settings.tls_ca_cert}")
            logger.debug(f"certfile={mqtt_settings.tls_certfile}")
            logger.debug(f"keyfile={mqtt_settings.tls_key}")
            self.mqtt_client.tls_set(
                ca_certs=mqtt_settings.tls_ca_cert,
                certfile=mqtt_settings.tls_certfile,
                keyfile=mqtt_settings.tls_key,
                cert_reqs=ssl.CERT_REQUIRED,
                tls_version=ssl.PROTOCOL_TLS,
            )
        elif mqtt_settings.use_tls:
            logger.info(f"Connecting to {mqtt_settings.host}:{mqtt_settings.port} with SSL and username/password authentication")
            logger.debug(f"ca_certs={mqtt_settings.tls_ca_cert}")
            if mqtt_settings.tls_ca_cert:
                self.mqtt_client.tls_set(
                    ca_certs=mqtt_settings.tls_ca_cert,
                    cert_reqs=ssl.CERT_REQUIRED,
                    tls_version=ssl.PROTOCOL_TLS,
                )
            else:
                self.mqtt_client.tls_set(
                    cert_reqs=ssl.CERT_REQUIRED,
                    tls_version=ssl.PROTOCOL_TLS,
                )
            if mqtt_settings.username:
                self.mqtt_client.username_pw_set(mqtt_settings.username, password=mqtt_settings.password)
        else:
            logger.debug(f"Connecting to {mqtt_settings.host}:{mqtt_settings.port} without SSL")
            if mqtt_settings.username:
                self.mqtt_client.username_pw_set(mqtt_settings.username, password=mqtt_settings.password)
        if on_connect:
            logger.debug("Registering custom callback function")
            self.mqtt_client.on_connect = on_connect

        if self._settings.manual_availability:
            self.mqtt_client.will_set(self.availability_topic, "offline", retain=True)

    def _connect_client(self) -> None:
        """Connect the client to the MQTT broker, start its onw internal loop in
        a separate thread"""
        result = self.mqtt_client.connect(self._settings.mqtt.host, self._settings.mqtt.port or 1883)
        # Check if we have established a connection
        if result != mqtt.MQTT_ERR_SUCCESS:
            raise RuntimeError("Error while connecting to MQTT broker")

        # Start the internal network loop of the MQTT library to handle incoming
        # messages in a separate thread
        self.mqtt_client.loop_start()

    def _state_helper(
            self, state: Optional[Union[str, float, int]], topic: Optional[str] = None, last_reset: Optional[str] = None, retain=True
    ) -> Optional[MQTTMessageInfo]:
        """
        Write a state to the given MQTT topic, returning the result of client.publish()
        """
        if not self.wrote_configuration:
            logger.debug("Writing sensor configuration")
            self.write_config()
        if not topic:
            logger.debug(f"State topic unset, using default: {self.state_topic}")
            topic = self.state_topic
        if last_reset:
            state = {"state": state, "last_reset": last_reset}
            state = json.dumps(state)
        logger.debug(f"Writing '{state}' to {topic}")

        if self._settings.debug:
            logger.debug(f"Debug is {self.debug}, skipping state write")
            return

        message_info = self.mqtt_client.publish(topic, state, retain=retain)
        logger.debug(f"Publish result: {message_info}")
        return message_info

    def debug_mode(self, mode: bool):
        self.debug = mode
        logger.debug(f"Set debug mode to {self.debug}")

    def delete(self) -> None:
        """
        Delete a synthetic sensor from Home Assistant via MQTT message.

        Based on https://www.home-assistant.io/docs/mqtt/discovery/

        mosquitto_pub -r -h 127.0.0.1 -p 1883 \
            -t "homeassistant/binary_sensor/garden/config" \
            -m '{"name": "garden", "device_class": "motion", \
            "state_topic": "homeassistant/binary_sensor/garden/state"}'
        """

        config_message = ""
        logger.info(
            f"Writing '{config_message}' to topic {self.config_topic} on {self._settings.mqtt.host}:{self._settings.mqtt.port}"
        )
        self.mqtt_client.publish(self.config_topic, config_message, retain=True)

    def generate_config(self) -> dict[str, Any]:
        """
        Generate a dictionary that we'll grind into JSON and write to MQTT.

        Will be used with the MQTT discovery protocol to make Home Assistant
        automagically ingest the new sensor.
        """
        # Automatically generate a dict using pydantic
        config = self._entity.model_dump(exclude_none=True, by_alias=True)
        # Add the MQTT topics to be discovered by HA
        topics = {
            "state_topic": self.state_topic,
            "json_attributes_topic": self.attributes_topic,
        }
        # Add availability topic if defined
        if hasattr(self, "availability_topic"):
            topics["availability_topic"] = self.availability_topic
        return config | topics

    def write_config(self):
        """
        mosquitto_pub -r -h 127.0.0.1 -p 1883 \
            -t "homeassistant/binary_sensor/garden/config" \
            -m '{"name": "garden", "device_class": "motion", \
                "state_topic": "homeassistant/binary_sensor/garden/state"}'
        """
        config_message = json.dumps(self.generate_config())

        logger.debug(
            f"Writing '{config_message}' to topic {self.config_topic} on {self._settings.mqtt.host}:{self._settings.mqtt.port}"
        )
        self.wrote_configuration = True
        self.config_message = config_message

        if self._settings.debug:
            logger.debug("Debug mode is enabled, skipping config write.")
            return None

        return self.mqtt_client.publish(self.config_topic, config_message, retain=True)

    def set_attributes(self, attributes: dict[str, Any]):
        """Update the attributes of the entity

        Args:
            attributes: dictionary containing all the attributes that will be \
            set for this entity
        """
        # HA expects a JSON object in the attribute topic
        json_attributes = json.dumps(attributes)
        logger.debug("Updating attributes: %s", json_attributes)
        self._state_helper(json_attributes, topic=self.attributes_topic)

    def set_availability(self, availability: bool):
        if not hasattr(self, "availability_topic"):
            raise RuntimeError("Manual availability is not configured for this entity!")
        message = "online" if availability else "offline"
        self._state_helper(message, topic=self.availability_topic)

    def _update_state(self, state) -> None:
        """
        Update MQTT device state

        Override in subclasses
        """
        self._state_helper(state=state)

    def __del__(self):
        """Cleanly shutdown the internal MQTT client"""
        logger.debug("Shutting down MQTT client")
        self.mqtt_client.disconnect()
        self.mqtt_client.loop_stop()
