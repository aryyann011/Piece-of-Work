from fastapi import APIRouter, Depends, HTTPException, status
from firebase_admin import auth, firestore
from app.core.security import verify_token
from app.core.firebase_admin import db
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])


class RegistrationRequest(BaseModel):
    reg_no: str


@router.post("/verify-registration", status_code=status.HTTP_200_OK)
def verify_registration(
    data: RegistrationRequest,
    user=Depends(verify_token)
):
    uid = user["uid"]
    reg_no = data.reg_no

    if not user.get("email_verified"):
        auth.delete_user(uid)
        raise HTTPException(status_code=403, detail="Email not verified")

    ref = db.collection("valid_students").document(reg_no)
    doc = ref.get()

    if not doc.exists:
        auth.delete_user(uid)
        raise HTTPException(status_code=403, detail="Not a campus student")

    student_info = doc.to_dict()

    if student_info.get("is_registered"):
        auth.delete_user(uid)
        raise HTTPException(status_code=403, detail="Reg no already used")

    ref.update({
        "is_registered": True,
        "uid": uid
    })

    db.collection("users").document(uid).set({
        "reg_no": reg_no,
        "dept": student_info.get("DEPT"),
        "email": user.get("email"),
        "created_at": firestore.SERVER_TIMESTAMP
    })

    print(f"✅ User {uid} registered successfully")

    return {
        "message": "Campus Access Granted",
        "dept": student_info.get("DEPT")
    }
@router.get("/profile", status_code=status.HTTP_200_OK)
def get_profile(user=Depends(verify_token)):
    uid = user["uid"]

    user_ref = db.collection("users").document(uid)
    user_doc = next(user_ref.limit(1).stream(), None)

    if not user_doc:
        raise HTTPException(status_code=404, detail="User profile not found")

    profile_data = user_doc.to_dict()

    return {
        **profile_data,
        "email": user.get("email"),
        "email_verified": user.get("email_verified")
    }
