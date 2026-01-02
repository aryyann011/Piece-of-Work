import React, { useState, useEffect } from "react";
import CardStack from "../components/Cards/CardStack";
import LightRays from "../components/effects/LightRays";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/mainContext";

import {
    collection,
    getDocs,
    getDoc,
    query,
    where,
    serverTimestamp,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot // Added for real-time updates
} from "firebase/firestore";
import { db } from "../conf/firebase";

const PUBLIC_GROUPS = [
    { id: "c1", name: "General Campus", members: 358 },
    { id: "c2", name: "Tech Talk", members: 120 },
    { id: "c3", name: "Events & Fests", members: 85 },
    { id: "c4", name: "Gaming Club", members: 64 },
];

const Discovery = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
    const [loading, setLoading] = useState(true);

    // ---------------- 1. FETCH DISCOVERY USERS ----------------
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1000);
        window.addEventListener("resize", handleResize);

        const fetchUsers = async () => {
            try {
                // Fetch all potential users
                const snap = await getDocs(collection(db, "users"));
                const list = snap.docs
                    .map(d => ({
                        uid: d.id,
                        name: d.data().Name,
                        major: d.data().DEPT?.toUpperCase(),
                        bio: d.data().BIO || "",
                        photoUrl: d.data().photoURL || "",
                    }))
                    .filter(u => u.uid !== authUser?.uid);

                setUsers(list);
            } catch (err) {
                console.error("Fetch users error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (authUser) fetchUsers();
        return () => window.removeEventListener("resize", handleResize);
    }, [authUser]);

    // ---------------- 2. REAL-TIME INCOMING REQUESTS ----------------
    useEffect(() => {
        if (!authUser) return;

        // Query for requests sent TO the current user that are still pending
        const q = query(
            collection(db, "friend_requests"),
            where("to", "==", authUser.uid),
            where("status", "==", "pending")
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            const requests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setFriendRequests(requests);
        });

        return () => unsubscribe();
    }, [authUser]);

    // ---------------- 3. SEND FRIEND REQUEST (SWIPE DOWN) ----------------
    const sendFriendRequest = async (targetUser) => {
        if (!authUser || !targetUser?.uid) return;
        if (authUser.uid === targetUser.uid) return;

        // Standard ID format: "senderUID_receiverUID"
        const requestId = `${authUser.uid}_${targetUser.uid}`;
        const reverseId = `${targetUser.uid}_${authUser.uid}`;

        try {
            // Check if the other person already sent YOU a request
            const reverseSnap = await getDoc(doc(db, "friend_requests", reverseId));
            if (reverseSnap.exists()) {
                alert("This user already sent you a request! Check your requests panel.");
                return;
            }

            // Create the request document
            await setDoc(doc(db, "friend_requests", requestId), {
                from: authUser.uid,
                to: targetUser.uid,
                status: "pending",
                createdAt: serverTimestamp(),
            });

            console.log("Request successfully sent to:", targetUser.name);
        } catch (err) {
            console.error("Error sending friend request:", err);
        }
    };

    // ---------------- 4. ACCEPT / REJECT ----------------
    const acceptRequest = async (id) => {
        try {
            await updateDoc(doc(db, "friend_requests", id), {
                status: "accepted",
            });
            // The onSnapshot listener will automatically remove it from the UI list
        } catch (err) {
            console.error("Error accepting request:", err);
        }
    };

    const rejectRequest = async (id) => {
        try {
            await deleteDoc(doc(db, "friend_requests", id));
        } catch (err) {
            console.error("Error rejecting request:", err);
        }
    };

    return (
        <div style={{
            display: isMobile ? "flex" : "grid",
            flexDirection: "column",
            gridTemplateColumns: "1fr 350px",
            gap: "20px",
            height: "100%",
            padding: "20px"
        }}>
            {/* LEFT SECTION: DISCOVERY STACK */}
            <div className="dashboard-card" style={{ position: "relative", paddingTop: "30px", overflow: "hidden" }}>
                <div style={{ padding: "0 30px", marginBottom: "20px" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#0b0c15",
                        padding: "10px",
                        borderRadius: "8px",
                        maxWidth: "300px"
                    }}>
                        <Search size={16} color="#666" />
                        <input
                            placeholder="Reg No or Name"
                            style={{ background: "transparent", border: "none", color: "white", marginLeft: "10px", outline: "none" }}
                        />
                    </div>
                </div>

                <div style={{ transform: "scale(0.9)", display: "flex", justifyContent: "center", height: "500px" }}>
                    {loading ? (
                        <p style={{ color: "#aaa" }}>Finding students...</p>
                    ) : users.length > 0 ? (
                        <CardStack
                            users={users}
                            onSwipeDown={sendFriendRequest} // Triggered when swiped down
                            onSwipeUp={(u) => console.log("Skipped:", u.name)}
                        />
                    ) : (
                        <p style={{ color: "#777" }}>No more users to discover</p>
                    )}
                </div>

                <LightRays raysColor="#ff2a6d" />
            </div>

            {/* RIGHT SECTION: SIDEBAR */}
            <div className="dashboard-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                    <h3 style={{ color: "white", marginBottom: "15px" }}>Friend Requests</h3>
                    {friendRequests.length === 0 ? (
                        <p style={{ color: "#777", fontSize: "14px" }}>No new requests</p>
                    ) : (
                        friendRequests.map(req => (
                            <div key={req.id} style={{
                                background: "rgba(255,255,255,0.05)",
                                padding: "12px",
                                borderRadius: "10px",
                                marginBottom: "10px",
                                border: "1px solid rgba(255,255,255,0.1)"
                            }}>
                                <p style={{ color: "white", fontSize: "14px", marginBottom: "10px" }}>
                                    User <span style={{ color: "#ff2a6d" }}>{req.from.slice(0, 5)}...</span> wants to connect
                                </p>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        onClick={() => acceptRequest(req.id)}
                                        style={{ 
                                            flex: 1, 
                                            background: "#22c55e", 
                                            border: "none", 
                                            padding: "8px", 
                                            borderRadius: "5px", 
                                            color: "white", 
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}>
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => rejectRequest(req.id)}
                                        style={{ 
                                            flex: 1, 
                                            background: "#ef4444", 
                                            border: "none", 
                                            padding: "8px", 
                                            borderRadius: "5px", 
                                            color: "white", 
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />

                <div>
                    <h3 style={{ color: "white", marginBottom: "15px" }}>Connect Rooms</h3>
                    {PUBLIC_GROUPS.map(g => (
                        <div key={g.id} style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center", 
                            marginTop: "12px" 
                        }}>
                            <div>
                                <div style={{ color: "white", fontSize: "15px" }}>{g.name}</div>
                                <div style={{ color: "#777", fontSize: "12px" }}>{g.members} members</div>
                            </div>
                            <button
                                onClick={() => navigate("/chat")}
                                style={{ 
                                    background: "rgba(255,255,255,0.1)", 
                                    color: "white", 
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    padding: "5px 15px",
                                    borderRadius: "20px",
                                    cursor: "pointer"
                                }}>
                                Join
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Discovery;