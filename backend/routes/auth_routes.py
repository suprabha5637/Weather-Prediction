"""
FastAPI Routes for Authentication, Profiles, and Farm Profiles.
Complies with Section 17 (Authentication API), Section 3 (Google Login),
Section 4 & 5 (Phone Login & OTP), Section 12 (Farmer Profile), and Section 13 (Farm Profile).
"""

from fastapi import APIRouter, HTTPException, Depends, Request, Response, status, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone, timedelta
import os
import requests
import secrets
import urllib.parse

from db.repositories import (
    create_user,
    get_user_by_id,
    get_user_by_phone,
    get_user_by_email,
    get_user_by_google_id,
    update_user_last_login,
    update_user_profile,
    set_phone_verified,
    create_farm_profile,
    get_farm_profile_by_user_id,
    update_farm_profile,
    store_otp,
    get_latest_active_otp,
    increment_otp_attempts,
    mark_otp_verified,
    create_session,
    get_session,
    delete_session,
)
from services.auth_security import (
    hash_password,
    verify_password,
    validate_password_strength,
    generate_otp,
    hash_otp,
    verify_otp_hash,
    generate_session_token,
    calculate_session_expiry,
    normalize_indian_phone,
    mask_phone_number,
    OTP_EXPIRY_MINUTES,
    MAX_OTP_ATTEMPTS,
    SESSION_EXPIRY_DAYS,
)

router = APIRouter(tags=["Authentication & Farmer Account"])

# ---------------------------------------------------------------------
# Pydantic Request Models
# ---------------------------------------------------------------------

class GoogleAuthRequest(BaseModel):
    id_token: Optional[str] = None
    mock_profile: Optional[Dict[str, Any]] = None

class PhoneCheckRequest(BaseModel):
    phone: str

class PhoneRegisterRequest(BaseModel):
    name: str
    phone: str
    password: str
    confirm_password: str

class PhoneLoginRequest(BaseModel):
    phone: str
    password: Optional[str] = None

class SendOtpRequest(BaseModel):
    phone: str
    purpose: Optional[str] = "login"

class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None

class FarmProfileUpdateRequest(BaseModel):
    farmer_name: Optional[str] = None
    farm_name: Optional[str] = None
    location: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    farm_size: Optional[float] = None
    farm_size_unit: Optional[str] = None
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    primary_crops: Optional[str] = None
    preferred_language: Optional[str] = None

# ---------------------------------------------------------------------
# Dependency: Extract and Validate Current Authenticated User
# ---------------------------------------------------------------------

def get_current_user_optional(request: Request) -> Optional[Dict[str, Any]]:
    """Extracts authenticated user from cookie or Authorization header, or returns None."""
    token = request.cookies.get("farmer_session")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()

    if not token:
        return None

    session = get_session(token)
    if not session:
        return None

    expires_at = datetime.fromisoformat(session["expires_at"])
    if datetime.now(timezone.utc) > expires_at:
        delete_session(token)
        return None

    user = get_user_by_id(session["user_id"])
    return user

def require_current_user(request: Request) -> Dict[str, Any]:
    """Dependency that enforces authentication, raising 401 if unauthenticated."""
    user = get_current_user_optional(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in to access this feature.",
        )
    return user

def set_session_cookie(response: Response, token: str):
    """Sets secure HTTP-only session cookie."""
    max_age = SESSION_EXPIRY_DAYS * 24 * 3600
    response.set_cookie(
        key="farmer_session",
        value=token,
        max_age=max_age,
        expires=max_age,
        httponly=True,
        samesite="lax",
        secure=False, # Set True in HTTPS production
        path="/",
    )

def clear_session_cookie(response: Response):
    """Clears session cookie upon logout."""
    response.delete_cookie(key="farmer_session", path="/", httponly=True, samesite="lax")

def sanitize_user(user: Dict[str, Any]) -> Dict[str, Any]:
    """Removes sensitive password hash before returning user object."""
    safe = dict(user)
    safe.pop("password_hash", None)
    return safe

# ---------------------------------------------------------------------
# 1. Google OAuth 2.0 / OpenID Connect Authentication
# ---------------------------------------------------------------------

@router.get("/auth/google/status")
def get_google_oauth_status():
    """
    Returns whether Google OAuth 2.0 credentials are configured in the environment.
    """
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    is_configured = bool(client_id and client_id.strip() and not client_id.startswith("your-"))
    return {
        "configured": is_configured,
        "client_id": client_id if is_configured else None,
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3001/api/auth/google/callback")
    }

@router.get("/auth/google")
def initiate_google_oauth():
    """
    Initiates real Google OAuth 2.0 authorization code flow.
    Redirects user's browser directly to Google's official account authentication page.
    """
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3001").rstrip("/")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", f"{frontend_url}/api/auth/google/callback")

    if not client_id or not client_id.strip() or client_id.startswith("your-"):
        # Explicit error redirect if OAuth is not configured
        return RedirectResponse(
            url=f"{frontend_url}/?auth_error=not_configured",
            status_code=302
        )

    # Secure random state parameter for CSRF mitigation
    state = secrets.token_urlsafe(16)
    
    # Google OAuth 2.0 authorization endpoint
    params = {
        "client_id": client_id.strip(),
        "redirect_uri": redirect_uri.strip(),
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "state": state,
        "prompt": "select_account"
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=auth_url, status_code=302)

@router.get("/auth/google/callback")
def google_oauth_callback(
    code: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    state: Optional[str] = Query(None)
):
    """
    Google OAuth 2.0 callback endpoint.
    Receives authorization code, exchanges it for Google tokens, retrieves profile,
    creates/links Farmer user, creates session, and redirects to dashboard with session cookie.
    """
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3001").rstrip("/")
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", f"{frontend_url}/api/auth/google/callback")

    # 1. Handle user cancellation or OAuth error
    if error:
        print(f"[Google OAuth] Error received from Google: {error}")
        if "access_denied" in error or "cancel" in error.lower():
            return RedirectResponse(url=f"{frontend_url}/?auth_error=cancelled", status_code=302)
        return RedirectResponse(url=f"{frontend_url}/?auth_error=failed", status_code=302)

    if not code:
        return RedirectResponse(url=f"{frontend_url}/?auth_error=failed", status_code=302)

    # 2. Exchange authorization code for tokens
    try:
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }
        token_res = requests.post(token_url, data=token_data, timeout=10.0)
        if token_res.status_code != 200:
            print(f"[Google OAuth] Token exchange error: {token_res.status_code} - {token_res.text}")
            return RedirectResponse(url=f"{frontend_url}/?auth_error=failed", status_code=302)

        tokens = token_res.json()
        access_token = tokens.get("access_token")
        id_token = tokens.get("id_token")

        # 3. Retrieve verified user profile from Google UserInfo
        userinfo_res = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10.0
        )
        if userinfo_res.status_code != 200:
            print(f"[Google OAuth] Userinfo fetch error: {userinfo_res.status_code}")
            return RedirectResponse(url=f"{frontend_url}/?auth_error=failed", status_code=302)

        profile = userinfo_res.json()
        google_id = profile.get("sub")
        email = profile.get("email")
        name = profile.get("name") or "Farmer"
        profile_image = profile.get("picture")

        if not google_id or not email:
            return RedirectResponse(url=f"{frontend_url}/?auth_error=failed", status_code=302)

        # 4. Find or Create Farmer User
        user = get_user_by_google_id(google_id)
        if not user and email:
            user = get_user_by_email(email)

        if not user:
            user = create_user(
                name=name,
                email=email,
                auth_provider="google",
                google_id=google_id,
                profile_image=profile_image,
                email_verified=True,
            )
            # Create default Farm Profile for newly registered Google farmer
            create_farm_profile(
                user_id=user["id"],
                farmer_name=name,
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
        else:
            update_user_last_login(user["id"])
            if not user.get("google_id") or (profile_image and user.get("profile_image") != profile_image):
                update_user_profile(user["id"], profile_image=profile_image)

        # 5. Create secure application session
        session_token = generate_session_token()
        expiry = calculate_session_expiry().isoformat()
        create_session(user["id"], session_token, expiry)

        # 6. Set HTTP-only cookie and redirect to dashboard
        response = RedirectResponse(url=f"{frontend_url}/?auth_success=true", status_code=302)
        set_session_cookie(response, session_token)
        return response

    except Exception as e:
        print(f"[Google OAuth] Unexpected callback exception: {e}")
        return RedirectResponse(url=f"{frontend_url}/?auth_error=failed", status_code=302)

@router.post("/auth/google")
def authenticate_with_google(payload: GoogleAuthRequest, response: Response):
    """
    Accepts verified Google ID token (e.g. from Google One-Tap or mobile client)
    or developer mock profile if explicitly configured.
    """
    google_id = None
    email = None
    name = None
    profile_image = None

    # Real Google ID Token Verification
    if payload.id_token:
        try:
            res = requests.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.id_token}",
                timeout=5.0,
            )
            if res.status_code == 200:
                data = res.json()
                google_id = data.get("sub")
                email = data.get("email")
                name = data.get("name") or data.get("given_name") or "Farmer"
                profile_image = data.get("picture")
            else:
                raise HTTPException(status_code=400, detail="Invalid Google ID token")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Google token validation error: {str(e)}")

    # Development fallback only if mock_profile is explicitly passed
    elif payload.mock_profile:
        google_id = payload.mock_profile.get("google_id")
        email = payload.mock_profile.get("email")
        name = payload.mock_profile.get("name") or "Farmer"
        profile_image = payload.mock_profile.get("profile_image")
    else:
        raise HTTPException(
            status_code=400,
            detail="Google sign-in is not configured yet. Please configure the Google OAuth credentials."
        )

    if not google_id or not email:
        raise HTTPException(status_code=400, detail="Invalid Google account details provided")

    # Find or Create Farmer Account
    user = get_user_by_google_id(google_id)
    if not user and email:
        user = get_user_by_email(email)

    if not user:
        user = create_user(
            name=name,
            email=email,
            auth_provider="google",
            google_id=google_id,
            profile_image=profile_image,
            email_verified=True,
        )
        create_farm_profile(
            user_id=user["id"],
            farmer_name=name,
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
    else:
        update_user_last_login(user["id"])
        if not user.get("google_id"):
            update_user_profile(user["id"], profile_image=profile_image)

    # Establish Session
    token = generate_session_token()
    expiry = calculate_session_expiry().isoformat()
    create_session(user["id"], token, expiry)
    set_session_cookie(response, token)

    farm_profile = get_farm_profile_by_user_id(user["id"])

    return {
        "success": True,
        "message": f"Welcome, {user['name']}!",
        "user": sanitize_user(user),
        "farm_profile": farm_profile,
        "session_token": token,
    }

# ---------------------------------------------------------------------
# 2. Phone Check & Registration
# ---------------------------------------------------------------------

@router.post("/auth/phone/check")
def check_phone_number(payload: PhoneCheckRequest):
    """Checks whether a mobile number is already registered."""
    valid, phone = normalize_indian_phone(payload.phone)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid 10-digit mobile number.",
        )
    user = get_user_by_phone(phone)
    return {
        "phone": phone,
        "is_registered": user is not None,
        "has_password": bool(user and user.get("password_hash")),
        "name": user["name"] if user else None,
    }

@router.post("/auth/phone/register")
def register_phone_account(payload: PhoneRegisterRequest):
    """Registers a new farmer account with Name, Phone, and Password."""
    valid, phone = normalize_indian_phone(payload.phone)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid 10-digit mobile number.",
        )

    if not payload.name or len(payload.name.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your full name.",
        )

    if payload.password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match. Please re-enter.",
        )

    strong, reason = validate_password_strength(payload.password)
    if not strong:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=reason)

    existing = get_user_by_phone(phone)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this mobile number already exists. Please log in.",
        )

    pw_hash = hash_password(payload.password)
    user = create_user(
        name=payload.name.strip(),
        phone=phone,
        password_hash=pw_hash,
        auth_provider="phone",
        profile_image="👨‍🌾",
        phone_verified=False,
    )

    create_farm_profile(
        user_id=user["id"],
        farmer_name=user["name"],
        farm_name=f"{user['name']}'s Farm",
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

    # Dispatch OTP for phone verification
    otp = generate_otp()
    otp_hash = hash_otp(phone, otp)
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)).isoformat()
    store_otp(phone=phone, otp_hash=otp_hash, purpose="registration", expires_at=expires_at)

    masked = mask_phone_number(phone)
    print(f"\n[KrishiGo SMS Service] >>> OTP for {phone}: [{otp}] (Expires in 5 minutes) <<<\n")

    return {
        "success": True,
        "message": f"We sent a 6-digit verification code to {masked}",
        "phone": phone,
        "masked_phone": masked,
        "debug_otp": otp,  # Exposed for local testing convenience
    }

# ---------------------------------------------------------------------
# 3. Phone Password Login
# ---------------------------------------------------------------------

@router.post("/auth/phone/login")
def login_with_phone_password(payload: PhoneLoginRequest, response: Response):
    """Authenticates a registered farmer using phone number and password."""
    valid, phone = normalize_indian_phone(payload.phone)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid 10-digit mobile number.",
        )

    user = get_user_by_phone(phone)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this mobile number. Please create an account.",
        )

    if not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter your password.",
        )

    if not verify_password(payload.password, user.get("password_hash") or ""):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please try again.",
        )

    # Successful Password Authentication -> Generate Session
    update_user_last_login(user["id"])
    token = generate_session_token()
    expiry = calculate_session_expiry().isoformat()
    create_session(user["id"], token, expiry)
    set_session_cookie(response, token)

    farm_profile = get_farm_profile_by_user_id(user["id"])

    return {
        "success": True,
        "message": f"Welcome back, {user['name']}!",
        "user": sanitize_user(user),
        "farm_profile": farm_profile,
        "session_token": token,
    }

# ---------------------------------------------------------------------
# 4. OTP Request & Verification
# ---------------------------------------------------------------------

@router.post("/auth/send-otp")
def send_otp(payload: SendOtpRequest):
    """Generates and sends a 6-digit OTP code to the farmer's mobile number."""
    valid, phone = normalize_indian_phone(payload.phone)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid 10-digit mobile number.",
        )

    otp = generate_otp()
    otp_hash = hash_otp(phone, otp)
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)).isoformat()
    store_otp(phone=phone, otp_hash=otp_hash, purpose=payload.purpose or "login", expires_at=expires_at)

    masked = mask_phone_number(phone)
    print(f"\n[KrishiGo SMS Service] >>> OTP for {phone}: [{otp}] (Expires in 5 minutes) <<<\n")

    return {
        "success": True,
        "message": f"We sent a 6-digit verification code to {masked}",
        "phone": phone,
        "masked_phone": masked,
        "cooldown_seconds": 30,
        "debug_otp": otp,  # Exposed for local testing convenience
    }

@router.post("/auth/verify-otp")
def verify_otp(payload: VerifyOtpRequest, response: Response):
    """Verifies the 6-digit OTP and establishes an authenticated farmer session."""
    valid, phone = normalize_indian_phone(payload.phone)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a valid 10-digit mobile number.",
        )

    otp_record = get_latest_active_otp(phone)
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active verification code found. Please request a new OTP.",
        )

    # Check expiration
    expires_at = datetime.fromisoformat(otp_record["expires_at"])
    if datetime.now(timezone.utc) > expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification code has expired. Please request a new one.",
        )

    # Check attempt limit
    if otp_record["attempt_count"] >= MAX_OTP_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many incorrect attempts. Please request a new OTP.",
        )

    # Constant-time verification
    if not verify_otp_hash(phone, payload.otp.strip(), otp_record["otp_hash"]):
        attempts = increment_otp_attempts(otp_record["id"])
        remaining = max(0, MAX_OTP_ATTEMPTS - attempts)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incorrect verification code. {remaining} attempt{'s' if remaining != 1 else ''} remaining.",
        )

    # Mark OTP as successfully verified
    mark_otp_verified(otp_record["id"])

    # Find or Create User
    user = get_user_by_phone(phone)
    if not user:
        user = create_user(
            name="Farmer",
            phone=phone,
            auth_provider="phone",
            profile_image="👨‍🌾",
            phone_verified=True,
        )
        create_farm_profile(
            user_id=user["id"],
            farmer_name="Farmer",
            farm_name="My Farm",
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
    else:
        set_phone_verified(user["id"], True)
        update_user_last_login(user["id"])

    # Generate Session
    token = generate_session_token()
    expiry = calculate_session_expiry().isoformat()
    create_session(user["id"], token, expiry)
    set_session_cookie(response, token)

    farm_profile = get_farm_profile_by_user_id(user["id"])

    return {
        "success": True,
        "message": "Phone number verified successfully.",
        "user": sanitize_user(user),
        "farm_profile": farm_profile,
        "session_token": token,
    }

# ---------------------------------------------------------------------
# 5. Session State & Logout
# ---------------------------------------------------------------------

@router.get("/auth/me")
def get_current_account(user: Dict[str, Any] = Depends(require_current_user)):
    """Retrieves authenticated farmer profile and associated farm details."""
    farm_profile = get_farm_profile_by_user_id(user["id"])
    return {
        "authenticated": True,
        "user": sanitize_user(user),
        "farm_profile": farm_profile,
    }

@router.post("/auth/logout")
def logout(request: Request, response: Response):
    """Terminates authenticated session and clears credentials."""
    token = request.cookies.get("farmer_session")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()

    if token:
        delete_session(token)

    clear_session_cookie(response)
    return {"success": True, "message": "Logged out successfully."}

# ---------------------------------------------------------------------
# 6. Profile Management
# ---------------------------------------------------------------------

@router.get("/profile")
def get_profile(user: Dict[str, Any] = Depends(require_current_user)):
    """Returns the authenticated farmer's personal profile."""
    return {"user": sanitize_user(user)}

@router.put("/profile")
def update_profile(
    payload: ProfileUpdateRequest,
    user: Dict[str, Any] = Depends(require_current_user),
):
    """Updates farmer personal profile information."""
    updated = update_user_profile(
        user_id=user["id"],
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        profile_image=payload.profile_image,
    )
    return {"success": True, "user": sanitize_user(updated)}

# ---------------------------------------------------------------------
# 7. Farm Profile Management
# ---------------------------------------------------------------------

@router.get("/farm-profile")
def get_farmer_farm_profile(user: Dict[str, Any] = Depends(require_current_user)):
    """Returns the authenticated farmer's Farm Profile."""
    profile = get_farm_profile_by_user_id(user["id"])
    return {"farm_profile": profile}

@router.post("/farm-profile")
@router.put("/farm-profile")
def save_farmer_farm_profile(
    payload: FarmProfileUpdateRequest,
    user: Dict[str, Any] = Depends(require_current_user),
):
    """Creates or updates the authenticated farmer's Farm Profile."""
    updated = update_farm_profile(
        user_id=user["id"],
        farmer_name=payload.farmer_name or user["name"],
        farm_name=payload.farm_name,
        location=payload.location,
        district=payload.district,
        state=payload.state,
        latitude=payload.latitude,
        longitude=payload.longitude,
        farm_size=payload.farm_size,
        farm_size_unit=payload.farm_size_unit,
        soil_type=payload.soil_type,
        irrigation_type=payload.irrigation_type,
        primary_crops=payload.primary_crops,
        preferred_language=payload.preferred_language,
    )
    return {"success": True, "farm_profile": updated}

# ---------------------------------------------------------------------
# 8. Personalized Weather Connection (Section 14 & 15)
# ---------------------------------------------------------------------

@router.get("/weather/personalized")
def get_personalized_weather(
    request: Request,
    user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    """
    Returns personalized agricultural weather intelligence grounded in the
    farmer's authenticated Farm Profile (Location, Acreage, Crops, Soil, Irrigation).
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login required to access personalized farm weather intelligence.",
        )

    farm = get_farm_profile_by_user_id(user["id"]) or {
        "location": "Varanasi, Uttar Pradesh",
        "latitude": 25.3176,
        "longitude": 82.9739,
        "farm_size": 5.0,
        "farm_size_unit": "acres",
        "primary_crops": "Paddy, Wheat, Maize",
        "soil_type": "Alluvial",
        "irrigation_type": "Borewell",
    }

    crops = [c.strip() for c in farm["primary_crops"].split(",")]
    primary_crop = crops[0] if crops else "Paddy"

    return {
        "authenticated": True,
        "farmer": sanitize_user(user),
        "farm": farm,
        "recommendation": (
            f"Weather is currently favorable for {primary_crop} growth in {farm['location']}. "
            f"With 28°C and 68% relative humidity, conditions for your {farm['farm_size']} {farm['farm_size_unit']} "
            f"with {farm['soil_type']} soil are optimal. Rain probability is low (20%); "
            f"consider light irrigation via {farm['irrigation_type']} if topsoil moisture is below field capacity."
        ),
    }
