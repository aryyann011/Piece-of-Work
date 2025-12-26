import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
import logging

# ----------------- Logging setup -----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ----------------- Paths -----------------
APP_DIR = Path(__file__).resolve().parent.parent  # server/app
cred_path = APP_DIR / "services" / "firebase_key.json"  # Correct path to JSON

# ----------------- Initialize Firebase -----------------
db = None

def initialize_firebase():
    """Initializes Firebase Admin SDK and Firestore client."""
    global db

    # Check if Firebase is already initialized
    if not firebase_admin._apps:
        try:
            # Check if key exists
            if not cred_path.exists():
                logger.error(f"❌ Firebase key NOT found at: {cred_path}")
                return None

            # Load credentials
            cred = credentials.Certificate(str(cred_path))

            # Initialize Firebase
            firebase_admin.initialize_app(cred)
            logger.info("🔥 Firebase Admin SDK initialized successfully.")

        except Exception as e:
            logger.error(f"❌ Firebase failed to initialize: {e}")
            return None

    # Create Firestore client
    try:
        db_client = firestore.client()
        logger.info("✅ Firestore DB client created successfully.")
        return db_client
    except Exception as e:
        logger.error(f"❌ Firestore client creation failed: {e}")
        return None

# ----------------- Global DB -----------------
db = initialize_firebase()

# ----------------- Quick sanity check -----------------
if db is None:
    logger.error("❌ Firestore DB not connected! Check your key/path.")
else:
    logger.info("✅ Firestore DB connected and ready to use!")
