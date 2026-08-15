import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout.jsx'
import TasksCalendar from './pages/TasksCalendar.jsx'
import Habits from './pages/Habits.jsx'
import Shopping from './pages/Shopping.jsx'
import Budget from './pages/Budget.jsx'
import Notes from './pages/Notes.jsx'

export default function App() {
  const location = useLocation()

  return (
    <Routes location={location}>
      <Route element={<Layout />}>
        <Route
          path="*"
          element={
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<TasksCalendar />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/shopping" element={<Shopping />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/notes" element={<Notes />} />
              </Routes>
            </AnimatePresence>
          }
        />
      </Route>
    </Routes>
  )
}
