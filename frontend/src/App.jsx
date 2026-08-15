import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './auth/AuthContext.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import Layout from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import TasksCalendar from './pages/TasksCalendar.jsx'
import Habits from './pages/Habits.jsx'
import Shopping from './pages/Shopping.jsx'
import Budget from './pages/Budget.jsx'
import Notes from './pages/Notes.jsx'

function LandingGate() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/tasks" replace />
  return <Landing />
}

export default function App() {
  const location = useLocation()

  return (
    <Routes location={location}>
      <Route path="/" element={<LandingGate />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route
            path="*"
            element={
              <AnimatePresence mode="wait" initial={false}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/tasks" element={<TasksCalendar />} />
                  <Route path="/habits" element={<Habits />} />
                  <Route path="/shopping" element={<Shopping />} />
                  <Route path="/budget" element={<Budget />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="*" element={<Navigate to="/tasks" replace />} />
                </Routes>
              </AnimatePresence>
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}
