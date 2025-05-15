class Settings(BaseModel, Generic[EntityType]):

    """Connection to MQTT broker"""
    entity: EntityType
    debug: bool = False
    """Print out the message that would be sent over MQTT"""
    manual_availability: bool = False
    """If true, the entity `availability` inside HA must be manually managed
    using the `set_availability()` method"""
