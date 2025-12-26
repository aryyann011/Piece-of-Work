from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parent
SERVER_DIR = PROJECT_ROOT / "server"
if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))

if __name__ == "__main__":
    print("Added to sys.path:", SERVER_DIR)
    # Example import that previously failed:
    # from app.core import firebase_admin
    # firebase_admin.initialize_firebase()
