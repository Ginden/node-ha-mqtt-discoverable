class MQTT(BaseModel):
    """Connection settings for the MQTT broker"""

    # To use mqtt.Client
    model_config = ConfigDict(arbitrary_types_allowed=True)

    host: Optional[str] = "homeassistant"
    port: Optional[int] = 1883
    username: Optional[str] = None
    password: Optional[str] = None
    client_name: Optional[str] = None
    use_tls: Optional[bool] = False
    tls_key: Optional[str] = None
    tls_certfile: Optional[str] = None
    tls_ca_cert: Optional[str] = None

    discovery_prefix: str = "homeassistant"
    """The root of the topic tree where HA is listening for messages"""
    state_prefix: str = "hmd"
    """The root of the topic tree ha-mqtt-discovery publishes its state messages"""

    client: Optional[mqtt.Client] = None
    """Optional MQTT client to use for the connection. If provided, most other settings are ignored."""

mqtt: MQTT
