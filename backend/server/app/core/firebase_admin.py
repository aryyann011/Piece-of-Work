import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# 1. SETUP PATHS

APP_DIR = Path(__file__).resolve().parent.parent
cred_path = APP_DIR / "firebase_key.json"

# 2. INITIALIZE FIREBASE
# We use a global variable to store the database client
db = None

def initialize_firebase():
    """Initializes Firebase Admin SDK and Firestore client.

    """
    global db
  
    if not firebase_admin._apps:
        try:
           
            if not cred_path.exists():
                logger.error(f"❌ CRITICAL: Firebase key NOT found at: {cred_path}")
                return None
            
         
            cred = credentials.Certificate(str(cred_path))
        
            firebase_admin.initialize_app(cred)
            logger.info("🔥 Firebase Admin SDK initialized successfully.")
            
        except Exception as e:
            logger.error(f"❌ Firebase failed to initialize: {e}")
            return None

    return firestore.client()


db = initialize_firebase()