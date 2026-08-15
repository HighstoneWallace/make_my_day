import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import MobileTabBar from './MobileTabBar.jsx'
import MobileHeader from './MobileHeader.jsx'

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <MobileHeader />
        <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <MobileTabBar />
    </div>
  )
}
