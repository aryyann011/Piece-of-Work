import React from "react";
import CardStack from "../components/Cards/CardStack";
import LightRays from "../components/effects/LightRays"; 
import { Clock, Plus, ArrowRight } from "lucide-react";

// Dummy Data
const DUMMY_USERS = [
  { uid: "1", name: "Aisha Rahman", regNo: "2024CS01", major: "CSE", year: "3rd", bio: "Love coding and coffee", photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
  { uid: "2", name: "Rahul Verma", regNo: "2023IT99", major: "IT", year: "4th", bio: "Hackathon junkie", photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" },
  { uid: "3", name: "Priya Singh", regNo: "2025ECE12", major: "ECE", year: "2nd", bio: "Circuits & Coffee", photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" },
];

const Discovery = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "20px", height: "100%" }}>
      
      {/* --- COLUMN 2: THE STACK (Center) --- */}
      <div className="dashboard-card" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        
        {/* Header Text */}
        <div style={{ position: "absolute", top: "30px", left: "30px", zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: "24px" }}>The Stack & Discover</h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
             <input type="text" placeholder="Reg No or Name" style={{ background: "#0b0c15", border: "1px solid #333", padding: "10px", borderRadius: "8px", color: "white", width: "200px" }} />
          </div>
        </div>

        {/* The Card Stack Component */}
        {/* We reduce scale slightly to fit the dashboard panel */}
        <div style={{ transform: "scale(0.85)", marginTop: "40px" }}>
            <CardStack 
                users={DUMMY_USERS} 
                onSwipeDown={(u) => console.log("Req:", u.name)} 
                onSwipeUp={(u) => console.log("Skip:", u.name)} 
            />
        </div>

        {/* Background Effect (Confined to this panel) */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.5, pointerEvents: "none" }}>
            <LightRays raysColor="#ff2a6d" speed={1.0} />
        </div>
      </div>

      {/* --- COLUMN 3: RIGHT PANEL (Chat & Search) --- */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Widget 1: Ephemeral Chats */}
        <div className="dashboard-card" style={{ flex: 1, padding: "20px" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Chat expires in <span style={{ color: "#ff2a6d" }}>55:30!</span></h3>
              <Clock size={16} color="#ff2a6d" />
           </div>

           {/* Chat List */}
           <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {[1,2,3].map((_, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#333", backgroundImage: `url(${DUMMY_USERS[i % 3].photoUrl})`, backgroundSize: "cover" }} />
                      <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "14px", fontWeight: "600" }}>{DUMMY_USERS[i % 3].name}</div>
                          <div style={{ fontSize: "12px", color: "#666" }}>Typing...</div>
                      </div>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#05d9e8" }} />
                  </div>
              ))}
           </div>
        </div>

        {/* Widget 2: Connect Room Search */}
        <div className="dashboard-card" style={{ height: "40%", padding: "20px" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "16px" }}>Connect Room Search</h3>
            <input type="text" placeholder="Search..." style={{ width: "100%", padding: "12px", background: "#0b0c15", border: "none", borderRadius: "8px", color: "white", marginBottom: "15px" }} />
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1a1b26", padding: "10px", borderRadius: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                   <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#ff2a6d" }} />
                   <span style={{ fontSize: "13px" }}>Aisha Rahman</span>
                </div>
                <div style={{ background: "#05d9e8", padding: "5px", borderRadius: "6px" }}><Plus size={14} color="black" /></div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Discovery;