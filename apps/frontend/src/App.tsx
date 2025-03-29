import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LandingPage from "./components/home/LandingPage";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import { useAuthContext } from "./hooks/useAuthContext";
import "./index.css";

function App() {
  const { state } = useAuthContext();

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={state.user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!state.user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!state.user ? <Register /> : <Navigate to="/" />}
          />
          <Route path="/tmp" element={<LandingPage />} />

          {/* <Route
            path="/userprofile/:id"
            element={
              state.user?.role === `${import.meta.env.VITE_ROLE}` ? (
                <UserProfile />
              ) : (
                <Navigate to="/" />
              )
            }
          /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
