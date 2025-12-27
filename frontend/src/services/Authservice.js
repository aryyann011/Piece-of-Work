// src/services/authService.js
import { auth, db } from "../config/firebase";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail, // <--- Import this
  signOut 
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const registerStudent = async (email, password, regNo) => {
  const docRef = doc(db, "valid_students", regNo);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Registration number not found! Contact Admin.");
  }
  
  const studentData = docSnap.data();

  if (studentData.allowed_email && studentData.allowed_email !== email) {
    throw new Error(`This ID belongs to ${studentData.allowed_email}. You cannot use a different email.`);
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await sendEmailVerification(userCredential.user);
    await signOut(auth); 
    
    return { 
      status: "success", 
      message: "Account created! Please verify your email before logging in." 
    };

  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      
      await sendPasswordResetEmail(auth, email);
      
      return { 
        status: "reclaim", 
        message: "This ID is already in our system. We have sent a 'Reset Link' to your college email. Click it to reclaim your account and set your own password." 
      };
    }
    
    throw err;
  }
};