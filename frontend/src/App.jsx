// import { Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/mainContext";
// import Layout from "./components/Layout"; 

// // Pages
// import Login from "./pages/Login"; 
// import Discovery from "./pages/Discovery"; 

// // 1. The Bouncer (Security)
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <div>Loading...</div>;
//   if (!user) return <Navigate to="/login" />;
//   return children;
// };

// // 2. The Router Logic
// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
        
//         {/* PUBLIC ROUTE: Login (No Layout, Full Screen) */}
//         {/* <Route path="/login" element={<Login />} /> */}

//         {/* PROTECTED ROUTES (Wrapped in Layout) */}
//         <Route 
//           element={
//             <ProtectedRoute>
//               <Layout /> {/* <--- The Outlet lives inside here */}
//             </ProtectedRoute>
//           }
//         >
//           {/* These render INSIDE the <Outlet /> of Layout */}
//           <Route path="/" element={<Discovery />} />
//           <Route path="/matches" element={<div style={{color:'white'}}>Matches Page Coming Soon</div>} />
//         </Route>

//         {/* Catch All */}
//         <Route path="*" element={<Navigate to="/" />} />
        
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout"; 
import Discovery from "./pages/Discovery"; 
import Login from "./pages/Login"; 

function App() {
  return (
    <Routes>
      {/* 1. LOGIN (Full Screen, No Navbar) */}
      <Route path="/login" element={<Login />} />

      {/* 2. THE APP (Wrapped in Layout = Navbar Visible) */}
      <Route element={<Layout />}>
        {/* The Discovery page renders INSIDE the Layout */}
        <Route path="/" element={<Discovery />} />
        
        {/* Placeholder for other tabs */}
        <Route path="/search" element={<div style={{color:'white', textAlign:'center', marginTop:'100px'}}>Search Page</div>} />
        <Route path="/matches" element={<div style={{color:'white', textAlign:'center', marginTop:'100px'}}>Matches Page</div>} />
        <Route path="/profile" element={<div style={{color:'white', textAlign:'center', marginTop:'100px'}}>Profile Page</div>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;