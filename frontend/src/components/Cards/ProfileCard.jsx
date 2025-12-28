import React from "react";
import { MapPin, BookOpen, Hash, Quote } from "lucide-react";

const ProfileCard = ({ user, active }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "24px",
        background: `linear-gradient(180deg, rgba(20,20,30,0) 0%, #0a0b1e 90%), url(${user.photoUrl}) center/cover no-repeat`,
        position: "relative",
        // The "Neon Border" Effect
        boxShadow: active 
            ? "0px 0px 40px rgba(0, 212, 255, 0.4), inset 0 0 0 1px rgba(255,255,255,0.2)" 
            : "0px 10px 20px rgba(0,0,0,0.5)",
        overflow: "hidden",
        border: active ? "1px solid rgba(0, 212, 255, 0.5)" : "1px solid rgba(255,255,255,0.1)",
        transition: "all 0.3s ease"
      }}
    >
      {/* Top Gradient Overlay for readability */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, #050511 100%)" }} />

      {/* Floating Status Badge (Like 'Active Now') */}
      <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 6, alignItems: "center", background: "rgba(0,0,0,0.6)", padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ width: 8, height: 8, background: "#00ff88", borderRadius: "50%", boxShadow: "0 0 10px #00ff88" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#ccc" }}>Online</span>
      </div>

      {/* Content Area */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "24px", boxSizing: "border-box" }}>
        
        {/* Name & Age */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px" }}>
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            {user.name}
            </h1>
            <span style={{ fontSize: "20px", color: "#00d4ff", fontWeight: "600" }}>{user.year}</span>
        </div>

        {/* The Chips/Tags */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            <Badge icon={<Hash size={14} />} text={user.regNo} color="#ff007f" />
            <Badge icon={<BookOpen size={14} />} text={user.major} color="#00d4ff" />
        </div>

        {/* Bio Section */}
        <div style={{ 
            background: "rgba(255,255,255,0.05)", 
            backdropFilter: "blur(5px)", 
            padding: "12px", 
            borderRadius: "16px",
            borderLeft: "3px solid #ff007f"
        }}>
            <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: "1.5", fontStyle: "italic" }}>
             "{user.bio}"
            </p>
        </div>
      </div>
    </div>
  );
};

// Reusable Neon Badge
const Badge = ({ icon, text, color }) => (
  <div style={{ 
      display: "flex", alignItems: "center", gap: "6px", 
      background: `rgba(${color === '#ff007f' ? '255,0,127' : '0,212,255'}, 0.15)`, 
      padding: "6px 12px", 
      borderRadius: "12px", 
      border: `1px solid ${color}`, 
      color: color,
      fontSize: "13px",
      fontWeight: "600"
  }}>
    {icon}
    {text}
  </div>
);

export default ProfileCard;