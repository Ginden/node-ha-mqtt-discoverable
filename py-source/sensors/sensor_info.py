from ha_mqtt_discoverable import EntityInfo


class SensorInfo(EntityInfo):
    """Sensor specific information"""

    component: str = "sensor"
    unit_of_measurement: Optional[str] = None
    """Defines the units of measurement of the sensor, if any."""
    state_class: Optional[str] = None
    """Defines the type of state.
    If not None, the sensor is assumed to be numerical
    and will be displayed as a line-chart
    in the frontend instead of as discrete values."""
    value_template: Optional[str] = None
    """
    Defines a template to extract the value.
    If the template throws an error,
    the current state will be used instead."""
    last_reset_value_template: Optional[str] = None
    """
    Defines a template to extract the last_reset.
    When last_reset_value_template is set, the state_class option must be total.
    Available variables: entity_id.
    The entity_id can be used to reference the entity’s attributes."""
    suggested_display_precision: None | Annotated[int, Field(ge=0)] = None
    """
    The number of decimals which should be used in the sensor’s state after rounding.
    """
