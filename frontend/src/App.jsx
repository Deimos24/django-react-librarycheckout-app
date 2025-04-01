import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Contribute from "./pages/Contribute"
import Login from "./pages/Login"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Register from "./pages/Register"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />

}

function App() {

  return (

    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/contribute" element={
          <ProtectedRoute>
            <Contribute />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
