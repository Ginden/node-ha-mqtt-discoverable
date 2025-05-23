#    Copyright 2022-2024 Joe Block <jpb@unixorn.net>
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.

import json
import logging
import ssl
from collections.abc import Callable
from importlib import metadata
from typing import Any, Generic, Optional, TypeVar, Union

import paho.mqtt.client as mqtt
from paho.mqtt.client import MQTTMessageInfo
from pydantic import BaseModel, ConfigDict, model_validator

# Read version from the package metadata
__version__ = metadata.version(__package__)

logger = logging.getLogger(__name__)






EntityType = TypeVar("EntityType", bound=EntityInfo)






