from ha_mqtt_discoverable import Subscriber
from ha_mqtt_discoverable.sensors import CameraInfo


class Camera(Subscriber[CameraInfo]):
    """
    Implements an MQTT camera for Home Assistant MQTT discovery:
    https://www.home-assistant.io/integrations/image.mqtt/
    """

    def set_topic(self, image_topic: str) -> None:
        """
        Update the camera state (image URL).

        Args:
            image_topic (str): Topic of the image to be set as the camera state.
        """
        if not image_topic:
            raise RuntimeError("Image topic cannot be empty")

        logger.info(f"Publishing camera image topic {image_topic} to {self._entity.topic}")
        self._state_helper(image_topic)

    def set_availability(self, available: bool) -> None:
        """
        Update the camera availability status.

        Args:
            available (bool): Whether the camera is available or not.
        """
        payload = self._entity.payload_available if available else self._entity.payload_not_available
        logger.info(f"Setting camera availability to {payload} using {self._entity.availability_topic}")
        self.mqtt_client.publish(self._entity.availability_topic, payload, retain=self._entity.retain)
