import { Outlet, useLocation, Link } from "react-router-dom";
import { Search, MessageSquare, Users, Settings, LogOut, Hexagon } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/mainContext";

const Layout = () => {
    const { logout } = useAuth(); // <--- Get logout function
  const navigate = useNavigate(); // <--- Hook to redirect

  const handleLogout = async () => {
      await logout();
      navigate("/login"); // Force redirect to login page
  };
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", padding: "20px", boxSizing: "border-box", gap: "20px" }}>
      
      {/* 1. LEFT SIDEBAR (Fixed) */}
      <aside className="dashboard-card" style={{ width: "260px", display: "flex", flexDirection: "column", padding: "30px 20px" }}>
        
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "50px" }}>
          <Hexagon fill="#ff2a6d" stroke="none" size={32} />
          <div style={{ lineHeight: "1" }}>
            <div style={{ fontWeight: "800", fontSize: "18px", letterSpacing: "1px" }}>CAMPUS</div>
            <div style={{ fontWeight: "400", fontSize: "18px", color: "#05d9e8", letterSpacing: "2px" }}>CONNECT</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          <NavItem to="/" icon={<Search size={20} />} label="Discover" />
          <NavItem to="/chat" icon={<MessageSquare size={20} />} label="Chat Feed" />
          <NavItem to="/find" icon={<Users size={20} />} label="Find People" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        {/* Bottom Action */}
        <button 
            onClick={handleLogout} // <--- The Fix
            style={{ 
                marginTop: "auto", display: "flex", alignItems: "center", gap: "10px", 
                padding: "12px", background: "rgba(255, 42, 109, 0.1)", color: "#ff2a6d", 
                border: "1px solid #ff2a6d", borderRadius: "12px", cursor: "pointer", fontWeight: "600"
            }}
        >
           <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* 2. MAIN CONTENT AREA (Center + Right Panel) */}
      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <Outlet /> 
      </main>

    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} style={{
      display: "flex", alignItems: "center", gap: "15px",
      padding: "12px 15px", borderRadius: "12px",
      color: isActive ? "#fff" : "#6c757d",
      background: isActive ? "linear-gradient(90deg, rgba(5, 217, 232, 0.1) 0%, transparent 100%)" : "transparent",
      borderLeft: isActive ? "3px solid #05d9e8" : "3px solid transparent",
      textDecoration: "none", transition: "all 0.2s"
    }}>
      {icon}
      <span style={{ fontWeight: isActive ? "600" : "400" }}>{label}</span>
    </Link>
  );
};

export default Layout;