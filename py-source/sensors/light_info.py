from ha_mqtt_discoverable import EntityInfo


class LightInfo(EntityInfo):
    """Light specific information"""

    component: str = "light"

    state_schema: str = Field(default="json", alias="schema")  # 'schema' is a reserved word by pydantic
    """Sets the schema of the state topic, ie the 'schema' field in the configuration"""
    optimistic: Optional[bool] = None
    """Flag that defines if light works in optimistic mode.
    Default: true if no state_topic defined, else false."""
    payload_off: str = "OFF"
    """The payload that represents off state. If specified, will be used for
    both comparing to the value in the state_topic (see value_template and
    state_off for details) and sending as off command to the command_topic"""
    payload_on: str = "ON"
    """The payload that represents on state. If specified, will be used for both
    comparing to the value in the state_topic (see value_template and state_on
    for details) and sending as on command to the command_topic."""
    brightness: Optional[bool] = False
    """Flag that defines if the light supports setting the brightness
    """
    color_mode: Optional[bool] = None
    """Flag that defines if the light supports color mode"""
    supported_color_modes: Optional[list[str]] = None
    """List of supported color modes. See
    https://www.home-assistant.io/integrations/light.mqtt/#supported_color_modes for current list of
    supported modes. Required if color_mode is set"""
    effect: Optional[bool] = False
    """Flag that defines if the light supports effects"""
    effect_list: Optional[str | list] = None
    """List of supported effects. Required if effect is set"""
    retain: Optional[bool] = True
    """If the published message should have the retain flag on or not"""
    state_topic: Optional[str] = None
    """The MQTT topic subscribed to receive state updates."""
