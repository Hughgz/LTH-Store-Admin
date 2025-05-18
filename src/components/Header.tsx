import { HiOutlineMoon, HiOutlineSun, HiOutlineBell, HiOutlineMenu, HiOutlineSearch, HiOutlineUserCircle, HiOutlineLogout, HiOutlineCog } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { Link } from "react-router-dom";
import { toggleDarkMode } from "../features/darkMode/darkModeSlice";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppSelector((state) => state.darkMode);
  const user = useAppSelector((state) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        notificationRef.current && 
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sample notifications
  const notifications = [
    { id: 1, title: "New order received", time: "5 min ago", read: false },
    { id: 2, title: "Meeting scheduled", time: "1 hour ago", read: true },
    { id: 3, title: "Product update required", time: "Yesterday", read: false },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-6 py-3">
        {/* Left Section - Menu & Logo */}
        <div className="flex items-center gap-4">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 xl:hidden"
            onClick={() => dispatch(setSidebar())}
            aria-label="Toggle menu"
          >
            <HiOutlineMenu className="text-xl" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
              LTH
            </div>
            <span className="font-bold text-gray-800 dark:text-white text-lg hidden sm:inline-block">LTH Store Admin</span>
          </Link>
        </div>
        
        {/* Center Section - Search */}
        <div className="hidden md:block max-w-xl w-full mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg" />
          </div>
        </div>
        
        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
            <HiOutlineSearch className="text-xl" />
          </button>
          
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <HiOutlineSun className="text-xl" />
            ) : (
              <HiOutlineMoon className="text-xl" />
            )}
          </button>
          
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowDropdown(false);
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 relative"
              aria-label="Notifications"
            >
              <HiOutlineBell className="text-xl" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                2
              </span>
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800 dark:text-white">Notifications</h3>
                  <button className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 ${
                        !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`text-sm ${!notification.read ? "font-medium text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-300"}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                  <Link to="/notifications" className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg py-1 px-2 cursor-pointer"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {user?.username ? (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <HiOutlineUserCircle className="text-xl text-gray-500 dark:text-gray-400" />
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[100px]">
                  {user ? user.username : 'Guest'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user ? 'Admin' : 'No Role'}
                </span>
              </div>
            </button>
            
            {/* User Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 sm:hidden">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {user ? user.username : 'Guest'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user ? 'Admin' : 'No Role'}
                  </p>
                </div>
                <div className="py-1">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-750">
                    <HiOutlineUserCircle className="text-lg" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-750">
                    <HiOutlineCog className="text-lg" />
                    <span>Settings</span>
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-750 w-full text-left">
                    <HiOutlineLogout className="text-lg" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Search - Conditionally rendered */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all"
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg" />
        </div>
      </div>
    </header>
  );
};

export default Header;
