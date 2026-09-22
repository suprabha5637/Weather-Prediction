"""
Security, Cryptography, Password Hashing, OTP, and Session Utilities.
Complies with Section 7 (Password Requirements), Section 8 (OTP Security), and Section 9 (Session Management).
"""

import hashlib
import hmac
import os
import re
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional, Tuple, Dict, Any

# Salt for system-level HMAC (can be configured via environment)
SYSTEM_SECRET_KEY = os.getenv("FARMER_SECRET_KEY", "krishigo_farmer_secret_key_2026_prod")
OTP_EXPIRY_MINUTES = 5
OTP_RESEND_COOLDOWN_SECONDS = 30
MAX_OTP_ATTEMPTS = 5
SESSION_EXPIRY_DAYS = 30

# ---------------------------------------------------------------------
# 1. Password Security (NIST / OWASP PBKDF2-HMAC-SHA256)
# ---------------------------------------------------------------------

def validate_password_strength(password: str) -> Tuple[bool, str]:
    """
    Validates password against security requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
    - At least one special character
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-+=\[\]\\\/]", password):
        return False, "Password must contain at least one special character (!@#$%^&* etc.)."
    return True, "Password meets strength requirements."

def hash_password(password: str) -> str:
    """Hashes a password with 600,000 rounds of PBKDF2-HMAC-SHA256."""
    salt = secrets.token_bytes(16)
    iterations = 600_000
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return f"pbkdf2_sha256${iterations}${salt.hex()}${derived.hex()}"

def verify_password(password: str, stored_hash: str) -> bool:
    """Verifies a plaintext password against a stored PBKDF2 hash using constant-time comparison."""
    if not stored_hash or not stored_hash.startswith("pbkdf2_sha256$"):
        return False
    try:
        parts = stored_hash.split("$")
        if len(parts) != 4:
            return False
        _, iterations_str, salt_hex, hash_hex = parts
        iterations = int(iterations_str)
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(hash_hex)
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
        return hmac.compare_digest(candidate, expected)
    except Exception:
        return False

# ---------------------------------------------------------------------
# 2. OTP Security (Cryptographic Random Generation & Salted Hashing)
# ---------------------------------------------------------------------

def generate_otp() -> str:
    """Generates a cryptographically secure 6-digit OTP."""
    # secrets.randbelow ensures unbiased distribution
    return str(secrets.randbelow(900_000) + 100_000)

def hash_otp(phone: str, otp: str) -> str:
    """Hashes the OTP combined with phone and system secret so raw OTP is never stored."""
    message = f"{phone}:{otp}:{SYSTEM_SECRET_KEY}".encode("utf-8")
    return hashlib.sha256(message).hexdigest()

def verify_otp_hash(phone: str, otp: str, stored_hash: str) -> bool:
    """Verifies candidate OTP against stored hash using constant-time comparison."""
    candidate_hash = hash_otp(phone, otp)
    return hmac.compare_digest(candidate_hash, stored_hash)

# ---------------------------------------------------------------------
# 3. Session Security
# ---------------------------------------------------------------------

def generate_session_token() -> str:
    """Generates a cryptographically secure URL-safe 32-byte session token."""
    return secrets.token_urlsafe(32)

def calculate_session_expiry() -> datetime:
    """Returns session expiry timestamp (30 days from now)."""
    return datetime.now(timezone.utc) + timedelta(days=SESSION_EXPIRY_DAYS)

# ---------------------------------------------------------------------
# 4. Indian Phone Number Formatting & Validation
# ---------------------------------------------------------------------

def normalize_indian_phone(phone: str) -> Tuple[bool, str]:
    """
    Validates and normalizes an Indian phone number.
    Returns (is_valid, normalized_phone_with_+91).
    Accepts:
    - 9876543210 (10 digits)
    - +919876543210
    - 09876543210
    """
    cleaned = re.sub(r"[\s\-\(\)]", "", phone.strip())
    if cleaned.startswith("+91"):
        digits = cleaned[3:]
    elif cleaned.startswith("91") and len(cleaned) == 12:
        digits = cleaned[2:]
    elif cleaned.startswith("0") and len(cleaned) == 11:
        digits = cleaned[1:]
    else:
        digits = cleaned

    if len(digits) == 10 and digits.isdigit() and digits[0] in "6789":
        return True, f"+91{digits}"
    return False, phone

def mask_phone_number(phone: str) -> str:
    """Masks a phone number for UI display e.g. +91 98XXX XX210."""
    if len(phone) >= 13:
        # +919876543210 -> +91 98XXX XX210
        return f"{phone[:3]} {phone[3:5]}XXX XX{phone[-3:]}"
    return phone
