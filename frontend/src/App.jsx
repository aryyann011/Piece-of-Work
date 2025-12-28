import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/mainContext";
import Layout from "./components/Layout"; 
import Discovery from "./pages/Discovery"; 
import Login from "./pages/Login"; 

// 1. The Bouncer (Security Check)
// This sits here so we don't need a separate file for it
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
     return (
       <div style={{ 
          height: "100vh", width: "100vw", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          background: "#0b0c15", color: "#00d4ff", 
          fontFamily: "sans-serif", letterSpacing: "2px"
       }}>
          LOADING CAMPUS...
       </div>
     );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// 2. The Main App Logic
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PUBLIC: Login */}
        <Route path="/login" element={<LoginWrapper />} />

        {/* PROTECTED: The Dashboard */}
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* These render INSIDE the Layout's <Outlet/> */}
          <Route path="/" element={<Discovery />} />
          
          {/* Placeholders for sidebar links */}
          <Route path="/chat" element={<Placeholder title="Chat Feed" />} />
          <Route path="/find" element={<Placeholder title="Find People" />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

// Helper: Redirects logged-in users to Dashboard if they try to go to /login
const LoginWrapper = () => {
  const { user, loading } = useAuth();
  if (loading) return null; // Wait for check
  if (user) return <Navigate to="/" />;
  return <Login />;
};

// Helper: Simple Placeholder for empty pages
const Placeholder = ({ title }) => (
  <div style={{ padding: "50px", color: "white", textAlign: "center" }}>
    <h1 style={{ color: "#00d4ff" }}>{title}</h1>
    <p style={{ opacity: 0.7 }}>Coming Soon</p>
  </div>
);

export default App;