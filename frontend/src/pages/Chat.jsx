import React, { useState } from "react";
import { Search, Hash, Send, MoreVertical, Phone, Video, MessageSquare  } from "lucide-react";

// --- DUMMY DATA (Replace with Real Firebase Data later) ---
const PRIVATE_CONTACTS = [
  { id: "p1", name: "Aisha Rahman", lastMsg: "Are you going to the hackathon?", time: "10:30 AM", unread: 2, photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80", online: true },
  { id: "p2", name: "Rahul Verma", lastMsg: "Yeah, the code is pushed.", time: "Yesterday", unread: 0, photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80", online: false },
];

const PUBLIC_CHANNELS = [
  { id: "c1", name: "General Talk", topic: "Anything and everything campus related." },
  { id: "c2", name: "Tech Talk 💻", topic: "Coding, gadgets, and hackathons." },
  { id: "c3", name: "Events & Fests", topic: "What's happening this weekend?" },
  { id: "c4", name: "Lost & Found", topic: "Did anyone find a blue hoodie?" },
];

const DUMMY_MESSAGES = [
  { id: 1, senderId: "p1", text: "Hey! Did you see the new problem statement?", time: "10:00 AM" },
  { id: 2, senderId: "me", text: "Yeah, just looking at it now. Looks tough.", time: "10:05 AM" },
  { id: 3, senderId: "p1", text: "We should team up. I have some ideas for the backend.", time: "10:15 AM" },
  { id: 4, senderId: "me", text: "Sounds good! Let's meet at the library in 20.", time: "10:30 AM" },
];
// ---------------------------------------------------------


const Chat = () => {
  const [activeTab, setActiveTab] = useState("private"); // 'private' or 'public'
  const [selectedChat, setSelectedChat] = useState(null); // Holds the entire contact/channel object
  const [messageInput, setMessageInput] = useState("");

  // Helper to get the right list based on tab
  const chatList = activeTab === "private" ? PRIVATE_CONTACTS : PUBLIC_CHANNELS;

  return (
    // Main 2-Column Grid Layout for Chat Page
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "20px", height: "100%" }}>
      
      {/* --- LEFT COLUMN: CHAT LIST & TABS --- */}
      <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* 1. The Top Tab Switcher */}
        <div style={{ display: "flex", padding: "15px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <TabButton label="Private" isActive={activeTab === "private"} onClick={() => { setActiveTab("private"); setSelectedChat(null); }} />
            <div style={{ width: "10px" }} /> {/* Spacer */}
            <TabButton label="Public Channels" isActive={activeTab === "public"} onClick={() => { setActiveTab("public"); setSelectedChat(null); }} />
        </div>

        {/* 2. Search Bar */}
        <div style={{ padding: "15px" }}>
             <div style={{ display: "flex", alignItems: "center", background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "10px" }}>
                 <Search size={18} color="#6c757d" style={{ marginRight: "10px" }} />
                 <input type="text" placeholder={`Search ${activeTab}...`} style={{ background: "transparent", border: "none", color: "white", outline: "none", width: "100%" }} />
             </div>
        </div>

        {/* 3. The Scrollable List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 15px 15px 15px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {chatList.map(item => (
                <div 
                    key={item.id} 
                    onClick={() => setSelectedChat(item)}
                    style={{ 
                        display: "flex", alignItems: "center", gap: "12px", padding: "12px", 
                        borderRadius: "12px", cursor: "pointer", transition: "all 0.2s",
                        background: selectedChat?.id === item.id ? "rgba(5, 217, 232, 0.1)" : "rgba(255,255,255,0.03)",
                        border: selectedChat?.id === item.id ? "1px solid #05d9e8" : "1px solid transparent"
                    }}
                >
                    {activeTab === "private" ? (
                        // PRIVATE CONTACT ITEM
                        <>
                          <div style={{ position: "relative" }}>
                             <img src={item.photoUrl} alt={item.name} style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }} />
                             {item.online && <div style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, background: "#00ff88", borderRadius: "50%", border: "2px solid var(--panel-bg)" }} />}
                          </div>
                          <div style={{ flex: 1, overflow: "hidden" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                  <span style={{ fontWeight: "600", fontSize: "15px" }}>{item.name}</span>
                                  <span style={{ fontSize: "12px", color: "#666" }}>{item.time}</span>
                              </div>
                              <div style={{ fontSize: "13px", color: "#aaa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.lastMsg}</div>
                          </div>
                        </>
                    ) : (
                        // PUBLIC CHANNEL ITEM
                        <>
                         <div style={{ width: "45px", height: "45px", borderRadius: "12px", background: "rgba(255, 42, 109, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff2a6d" }}>
                             <Hash size={24} />
                         </div>
                         <div>
                            <div style={{ fontWeight: "600", fontSize: "15px", color: activeTab === 'public' ? '#ff2a6d' : 'white' }}>{item.name}</div>
                            <div style={{ fontSize: "12px", color: "#666" }}>{item.topic}</div>
                         </div>
                        </>
                    )}
                </div>
            ))}
        </div>
      </div>


      {/* --- RIGHT COLUMN: THE CHAT WINDOW --- */}
      <div className="dashboard-card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {selectedChat ? (
          // ACTIVE CHAT VIEW
          <>
            {/* Header */}
            <div style={{ padding: "15px 25px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {activeTab === 'private' && <img src={selectedChat.photoUrl} style={{ width: "40px", height: "40px", borderRadius: "50%" }} />}
                    <div>
                        <h3 style={{ margin: 0, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                           {activeTab === 'public' && <Hash size={20} color="#ff2a6d" />}
                           {selectedChat.name}
                        </h3>
                        {activeTab === 'private' ? (
                           <span style={{ fontSize: "12px", color: "#00ff88" }}>Online now</span>
                        ) : (
                            <span style={{ fontSize: "12px", color: "#aaa" }}>{selectedChat.topic}</span>
                        )}
                    </div>
                </div>
                <div style={{ display: "flex", gap: "20px", color: "#05d9e8" }}>
                    {activeTab === 'private' && <Phone size={20} style={{ cursor: "pointer" }} />}
                    {activeTab === 'private' && <Video size={20} style={{ cursor: "pointer" }} />}
                    <MoreVertical size={20} style={{ cursor: "pointer" }} />
                </div>
            </div>

            {/* Messages Area (Scrollable) */}
            <div style={{ flex: 1, padding: "25px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Warning for Public Chat */}
                {activeTab === 'public' && (
                    <div style={{ textAlign: "center", fontSize: "13px", color: "#666", background: "rgba(255,255,255,0.05)", padding: "10px", borderRadius: "12px" }}>
                        This is a public channel. Remember to follow campus guidelines.
                    </div>
                )}

                {/* Dummy Messages Mapping */}
                {DUMMY_MESSAGES.map(msg => {
                    const isMe = msg.senderId === 'me';
                    return (
                        <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                            <div style={{ 
                                maxWidth: "70%", 
                                padding: "12px 16px", 
                                borderRadius: "16px",
                                borderTopRightRadius: isMe ? "4px" : "16px",
                                borderTopLeftRadius: !isMe ? "4px" : "16px",
                                background: isMe ? "linear-gradient(135deg, #05d9e8 0%, #0094ff 100%)" : "rgba(255,255,255,0.05)",
                                border: isMe ? "none" : "1px solid rgba(255,255,255,0.1)",
                                color: isMe ? "#000" : "#fff",
                                boxShadow: isMe ? "0 5px 15px rgba(5, 217, 232, 0.3)" : "none"
                            }}>
                                <div style={{ fontSize: "15px", lineHeight: "1.4" }}>{msg.text}</div>
                                <div style={{ fontSize: "11px", textAlign: "right", marginTop: "5px", opacity: 0.7 }}>{msg.time}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input Area */}
            <div style={{ padding: "20px", background: "rgba(0,0,0,0.2)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "center", background: "var(--bg-dark)", padding: "5px 5px 5px 20px", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <input 
                        type="text" 
                        placeholder={`Message ${activeTab === 'private' ? selectedChat.name : '#' + selectedChat.name}...`}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        style={{ flex: 1, background: "transparent", border: "none", color: "white", outline: "none", fontSize: "15px" }} 
                    />
                    <button style={{ width: "45px", height: "45px", borderRadius: "50%", background: "#05d9e8", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 0 15px rgba(5, 217, 232, 0.5)" }}>
                        <Send size={20} color="black" />
                    </button>
                </div>
            </div>
          </>
        ) : (
          // EMPTY STATE (No chat selected)
          <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#6c757d" }}>
              <MessageSquare size={60} style={{ marginBottom: "20px", opacity: 0.5 }} />
              <h2 style={{ margin: 0, color: "white" }}>Select a Conversation</h2>
              <p>Choose a private contact or join a public channel.</p>
          </div>
        )}
      </div>

    </div>
  );
};

// Small component for the top tabs
const TabButton = ({ label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        style={{ 
            flex: 1, padding: "10px", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "all 0.2s",
            background: isActive ? "rgba(255, 42, 109, 0.1)" : "transparent",
            color: isActive ? "#ff2a6d" : "#6c757d",
            borderBottom: isActive ? "3px solid #ff2a6d" : "3px solid transparent"
        }}
    >
        {label}
    </button>
)

export default Chat;