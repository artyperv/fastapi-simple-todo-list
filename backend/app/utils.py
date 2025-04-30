import logging
import random
import re
import string

from app.core.config import settings

logger = logging.getLogger(__name__)


def generate_random_string(length: int) -> str:
    characters = (
        string.ascii_letters + string.digits
    )  # Includes both letters and digits
    random_string = "".join(random.choices(characters, k=length))
    return random_string


def generate_otp() -> str:
    numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    random.shuffle(numbers)
    return "".join(str(x) for x in numbers[0:4])


def send_verification_code(_phone: int) -> str | None:
    code = generate_otp()
    # here should be usage of external sms center api
    logger.debug(code)
    return code


def validate_phone(str_phone: str | int) -> int:
    return int(re.sub(r"\D", "", str(str_phone)))
