import { react, useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Contribute from "./pages/Contribute"
import Login from "./pages/Login"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import Register from "./pages/Register"
import FindBooks from "./pages/FindBooks"
import Account from "./pages/Account"
import { UserContext, auth } from "./components/utils"
import "./styles/App.css"


function App() {

  const [isAuthorized, setIsAuthorized] = useState(null)

  function Logout() {
    setIsAuthorized(false)
    localStorage.clear()
    return <Navigate to="/login" />
  }

  function RegisterAndLogout() {
    setIsAuthorized(false)
    localStorage.clear()
    return <Register />
  }

  useEffect(() => {
    auth(setIsAuthorized).catch(() => setIsAuthorized(false))
  })

  return (
    <UserContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/books" element={
            <ProtectedRoute>
              <FindBooks />
            </ProtectedRoute>
          } />
          <Route path="/contribute" element={
            <ProtectedRoute>
              <Contribute />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>

  )
}

export default App
