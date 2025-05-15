class DeviceInfo(BaseModel):
    """Information about a device a sensor belongs to"""

    name: str
    model: Optional[str] = None
    manufacturer: Optional[str] = None
    sw_version: Optional[str] = None
    """Firmware version of the device"""
    hw_version: Optional[str] = None
    """Hardware version of the device"""
    identifiers: Optional[list[str] | str] = None
    """A list of IDs that uniquely identify the device. For example a serial number."""
    connections: Optional[list[tuple]] = None
    """A list of connections of the device to the outside world as a list of tuples\
        [connection_type, connection_identifier]"""
    configuration_url: Optional[str] = None
    """A link to the webpage that can manage the configuration of this device.
        Can be either an HTTP or HTTPS link."""
    via_device: Optional[str] = None
    """Identifier of a device that routes messages between this device and Home
        Assistant. Examples of such devices are hubs, or parent devices of a sub-device.
        This is used to show device topology in Home Assistant."""

    @model_validator(mode="before")
    def must_have_identifiers_or_connection(cls, values):
        """Check that either `identifiers` or `connections` is set"""
        identifiers, connections = values.get("identifiers"), values.get("connections")
        if identifiers is None and connections is None:
            raise ValueError("Define identifiers or connections")
        return values
