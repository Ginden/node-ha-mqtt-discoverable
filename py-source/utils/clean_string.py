import re


def clean_string(raw: str) -> str:
    """
    MQTT Discovery protocol only allows [a-zA-Z0-9_-]
    """
    result = re.sub(r"[^A-Za-z0-9_-]", "-", raw)
    return result

