"""
Seed default demo Farmer account and initial Farm Profile if empty.
"""

from db.database import init_db
from db.repositories import get_user_by_phone, create_user, create_farm_profile
from services.auth_security import hash_password

def seed_demo_farmer():
    init_db()
    demo_phone = "+919876543210"
    user = get_user_by_phone(demo_phone)
    if not user:
        pw_hash = hash_password("Farmer@2026")
        user = create_user(
            name="Suprabha",
            email="suprabha.farmer@krishigo.in",
            phone=demo_phone,
            password_hash=pw_hash,
            auth_provider="phone",
            profile_image="👨‍🌾",
            phone_verified=True,
            email_verified=True,
        )
        create_farm_profile(
            user_id=user["id"],
            farmer_name="Suprabha",
            farm_name="KrishiGo Smart Farm",
            location="Varanasi, Uttar Pradesh",
            district="Varanasi",
            state="Uttar Pradesh",
            latitude=25.3176,
            longitude=82.9739,
            farm_size=5.0,
            farm_size_unit="acres",
            soil_type="Alluvial",
            irrigation_type="Borewell",
            primary_crops="Paddy, Wheat, Maize",
            preferred_language="en",
        )
        print("Demo farmer account seeded successfully!")
    else:
        print("Demo farmer account already exists.")

if __name__ == "__main__":
    seed_demo_farmer()
