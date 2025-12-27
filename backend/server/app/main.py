from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

print("🚀 Starting Campus Connect server...")
from app.core.firebase_admin import db
print("🔥 Firebase loaded:", db is not None)

from app.routes import auth

app = FastAPI(title="Campus Connect")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "message": "Campus Connect is live!",
        "status": "Ready"
    }


@app.get("/test-db")
def test_db():
    try:
        docs = list(db.collection("valid_students").limit(1).stream())
        return {"status": "connected", "data_found": len(docs) > 0}
    except Exception as e:
        return {"status": "error", "details": str(e)}
