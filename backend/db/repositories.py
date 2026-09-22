"""
Data Access Layer (Repository Pattern) for Users, Farm Profiles, OTPs, and Sessions.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from db.database import get_db

# ---------------------------------------------------------------------
# User Repository
# ---------------------------------------------------------------------

def create_user(
    name: str,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    password_hash: Optional[str] = None,
    auth_provider: str = "phone",
    google_id: Optional[str] = None,
    profile_image: Optional[str] = None,
    phone_verified: bool = False,
    email_verified: bool = False,
) -> Dict[str, Any]:
    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO users (
                id, name, email, phone, password_hash, profile_image,
                auth_provider, google_id, phone_verified, email_verified,
                account_status, created_at, updated_at, last_login_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
            """,
            (
                user_id,
                name,
                email,
                phone,
                password_hash,
                profile_image,
                auth_provider,
                google_id,
                1 if phone_verified else 0,
                1 if email_verified else 0,
                now,
                now,
                now,
            ),
        )
    return get_user_by_id(user_id)

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def get_user_by_phone(phone: str) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE phone = ?", (phone,))
        row = cursor.fetchone()
        return dict(row) if row else None

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (email,))
        row = cursor.fetchone()
        return dict(row) if row else None

def get_user_by_google_id(google_id: str) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE google_id = ?", (google_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def update_user_last_login(user_id: str):
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?", (now, now, user_id))

def update_user_profile(
    user_id: str,
    name: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    profile_image: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    now = datetime.now(timezone.utc).isoformat()
    fields = []
    params = []
    if name is not None:
        fields.append("name = ?")
        params.append(name)
    if email is not None:
        fields.append("email = ?")
        params.append(email)
    if phone is not None:
        fields.append("phone = ?")
        params.append(phone)
    if profile_image is not None:
        fields.append("profile_image = ?")
        params.append(profile_image)
    if not fields:
        return get_user_by_id(user_id)
    fields.append("updated_at = ?")
    params.append(now)
    params.append(user_id)
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = ?", params)
    return get_user_by_id(user_id)

def set_phone_verified(user_id: str, verified: bool = True):
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET phone_verified = ?, updated_at = ? WHERE id = ?", (1 if verified else 0, now, user_id))

# ---------------------------------------------------------------------
# Farm Profile Repository
# ---------------------------------------------------------------------

def create_farm_profile(
    user_id: str,
    farmer_name: str,
    farm_name: str = "My Farm",
    location: str = "Varanasi, Uttar Pradesh",
    district: str = "Varanasi",
    state: str = "Uttar Pradesh",
    latitude: float = 25.3176,
    longitude: float = 82.9739,
    farm_size: float = 5.0,
    farm_size_unit: str = "acres",
    soil_type: str = "Alluvial",
    irrigation_type: str = "Borewell",
    primary_crops: str = "Paddy, Wheat, Maize",
    preferred_language: str = "en",
) -> Dict[str, Any]:
    profile_id = f"frm_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO farm_profiles (
                id, user_id, farmer_name, farm_name, location, district, state,
                latitude, longitude, farm_size, farm_size_unit, soil_type,
                irrigation_type, primary_crops, preferred_language,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                profile_id,
                user_id,
                farmer_name,
                farm_name,
                location,
                district,
                state,
                latitude,
                longitude,
                farm_size,
                farm_size_unit,
                soil_type,
                irrigation_type,
                primary_crops,
                preferred_language,
                now,
                now,
            ),
        )
    return get_farm_profile_by_user_id(user_id)

def get_farm_profile_by_user_id(user_id: str) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM farm_profiles WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def update_farm_profile(
    user_id: str,
    farm_name: Optional[str] = None,
    farmer_name: Optional[str] = None,
    location: Optional[str] = None,
    district: Optional[str] = None,
    state: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    farm_size: Optional[float] = None,
    farm_size_unit: Optional[str] = None,
    soil_type: Optional[str] = None,
    irrigation_type: Optional[str] = None,
    primary_crops: Optional[str] = None,
    preferred_language: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    now = datetime.now(timezone.utc).isoformat()
    existing = get_farm_profile_by_user_id(user_id)
    if not existing:
        return create_farm_profile(
            user_id=user_id,
            farmer_name=farmer_name or "Farmer",
            farm_name=farm_name or "My Farm",
            location=location or "Varanasi, Uttar Pradesh",
            district=district or "Varanasi",
            state=state or "Uttar Pradesh",
            latitude=latitude if latitude is not None else 25.3176,
            longitude=longitude if longitude is not None else 82.9739,
            farm_size=farm_size if farm_size is not None else 5.0,
            farm_size_unit=farm_size_unit or "acres",
            soil_type=soil_type or "Alluvial",
            irrigation_type=irrigation_type or "Borewell",
            primary_crops=primary_crops or "Paddy, Wheat, Maize",
            preferred_language=preferred_language or "en",
        )

    fields = []
    params = []
    mapping = {
        "farm_name": farm_name,
        "farmer_name": farmer_name,
        "location": location,
        "district": district,
        "state": state,
        "latitude": latitude,
        "longitude": longitude,
        "farm_size": farm_size,
        "farm_size_unit": farm_size_unit,
        "soil_type": soil_type,
        "irrigation_type": irrigation_type,
        "primary_crops": primary_crops,
        "preferred_language": preferred_language,
    }
    for k, v in mapping.items():
        if v is not None:
            fields.append(f"{k} = ?")
            params.append(v)
    if not fields:
        return existing
    fields.append("updated_at = ?")
    params.append(now)
    params.append(user_id)
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(f"UPDATE farm_profiles SET {', '.join(fields)} WHERE user_id = ?", params)
    return get_farm_profile_by_user_id(user_id)

# ---------------------------------------------------------------------
# OTP Repository
# ---------------------------------------------------------------------

def store_otp(phone: str, otp_hash: str, purpose: str = "login", expires_at: str = "") -> str:
    otp_id = f"otp_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        # Invalidate previous unverified OTPs for this phone
        cursor.execute("UPDATE otp_verifications SET verified = -1 WHERE phone = ? AND verified = 0", (phone,))
        cursor.execute(
            """
            INSERT INTO otp_verifications (
                id, phone, otp_hash, purpose, expires_at, attempt_count, verified, created_at
            ) VALUES (?, ?, ?, ?, ?, 0, 0, ?)
            """,
            (otp_id, phone, otp_hash, purpose, expires_at, now),
        )
    return otp_id

def get_latest_active_otp(phone: str) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT * FROM otp_verifications
            WHERE phone = ? AND verified = 0
            ORDER BY created_at DESC LIMIT 1
            """,
            (phone,),
        )
        row = cursor.fetchone()
        return dict(row) if row else None

def increment_otp_attempts(otp_id: str) -> int:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE otp_verifications SET attempt_count = attempt_count + 1 WHERE id = ?", (otp_id,))
        cursor.execute("SELECT attempt_count FROM otp_verifications WHERE id = ?", (otp_id,))
        row = cursor.fetchone()
        return row[0] if row else 0

def mark_otp_verified(otp_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE otp_verifications SET verified = 1 WHERE id = ?", (otp_id,))

# ---------------------------------------------------------------------
# Session Repository
# ---------------------------------------------------------------------

def create_session(user_id: str, session_token: str, expires_at: str) -> Dict[str, Any]:
    session_id = f"ses_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO sessions (id, user_id, session_token, expires_at, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (session_id, user_id, session_token, expires_at, now),
        )
    return {"id": session_id, "user_id": user_id, "token": session_token, "expires_at": expires_at}

def get_session(session_token: str) -> Optional[Dict[str, Any]]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM sessions WHERE session_token = ?", (session_token,))
        row = cursor.fetchone()
        return dict(row) if row else None

def delete_session(session_token: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sessions WHERE session_token = ?", (session_token,))

def delete_user_sessions(user_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
