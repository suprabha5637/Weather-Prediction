"""
Database initialization and connection management for Farmer Authentication & Profiles.
Uses SQLite for production-grade, zero-external-dependency local persistence.
"""

import sqlite3
import os
from contextlib import contextmanager
from datetime import datetime, timezone
import uuid

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "farmer_auth.db")

def get_db_connection():
    """Returns a SQLite connection with row factory enabled."""
    conn = sqlite3.connect(DB_PATH, timeout=10.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

@contextmanager
def get_db():
    """Context manager for safe database transactions."""
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Initializes the SQLite database tables and indexes."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with get_db() as conn:
        cursor = conn.cursor()

        # 1. Users Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT UNIQUE,
            password_hash TEXT,
            profile_image TEXT,
            auth_provider TEXT NOT NULL, -- 'google' or 'phone'
            google_id TEXT UNIQUE,
            phone_verified INTEGER DEFAULT 0,
            email_verified INTEGER DEFAULT 0,
            account_status TEXT DEFAULT 'active',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            last_login_at TEXT
        );
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_google ON users(google_id);")

        # 2. Farm Profiles Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS farm_profiles (
            id TEXT PRIMARY KEY,
            user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            farmer_name TEXT,
            farm_name TEXT DEFAULT 'My Farm',
            location TEXT DEFAULT 'Varanasi, Uttar Pradesh',
            district TEXT DEFAULT 'Varanasi',
            state TEXT DEFAULT 'Uttar Pradesh',
            latitude REAL DEFAULT 25.3176,
            longitude REAL DEFAULT 82.9739,
            farm_size REAL DEFAULT 5.0,
            farm_size_unit TEXT DEFAULT 'acres',
            soil_type TEXT DEFAULT 'Alluvial',
            irrigation_type TEXT DEFAULT 'Borewell',
            primary_crops TEXT DEFAULT 'Paddy, Wheat, Maize',
            preferred_language TEXT DEFAULT 'en',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_farm_profiles_user ON farm_profiles(user_id);")

        # 3. OTP Verifications Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS otp_verifications (
            id TEXT PRIMARY KEY,
            phone TEXT NOT NULL,
            otp_hash TEXT NOT NULL,
            purpose TEXT DEFAULT 'login',
            expires_at TEXT NOT NULL,
            attempt_count INTEGER DEFAULT 0,
            verified INTEGER DEFAULT 0,
            created_at TEXT NOT NULL
        );
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_verifications(phone);")

        # 4. Sessions Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            session_token TEXT UNIQUE NOT NULL,
            expires_at TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);")

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at:", DB_PATH)
