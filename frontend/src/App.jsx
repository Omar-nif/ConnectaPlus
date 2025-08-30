// App.jsx
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import HomePage from './pages/HomePage'
import Groups from './pages/Groups'
import GroupNew from './pages/GroupNew'
import GroupDetail from './pages/GroupDetail'
import ExploreGroups from './pages/ExploreGroups'
import ServiceGroups from './pages/ServiceGroups'
import Terms from './pages/Terms'        
import Privacy from './pages/Privacy'    
import ProtectedRoute from './components/ProtectedRoute'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />         {/* ← nuevo */}
        <Route path="/privacy" element={<Privacy />} />     {/* ← nuevo */}

        {/* privadas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/new"
          element={
            <ProtectedRoute>
              <GroupNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <ProtectedRoute>
              <GroupDetail />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/explore-groups"
          element={
            <ProtectedRoute>
              <ExploreGroups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Navigate to="/explore-groups" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/:slug/groups"
          element={
            <ProtectedRoute>
              <ServiceGroups />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 40 }}>404 — Página no encontrada</div>} />
      </Routes>
    </>
  )
}
