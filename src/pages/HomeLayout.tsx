import { Outlet } from "react-router-dom"
import { useState } from "react"
import { Header, Sidebar } from "../components"

const HomeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="h-full overflow-y-auto p-4 md:p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 bg-white shadow-inner dark:bg-gray-800">
          <div className="container mx-auto px-6 text-center text-sm text-gray-600 dark:text-gray-400">
            © 2024 Your Company. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomeLayout