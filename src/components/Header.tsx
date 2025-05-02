import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../utils/hooks/useAuth';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { token, logoutUser } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Search */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-indigo-500">
            <input
              className="w-full pl-4 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 form-input"
              type="text"
              placeholder="Search..."
              aria-label="Search"
            />
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Theme toggler */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={toggleDarkMode}
              aria-label="Toggle color mode"
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>
          </li>

          {/* Notifications */}
          <li className="relative">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              <span
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                aria-hidden="true"
              ></span>
            </button>
          </li>

          {/* Profile menu */}
          <li className="relative">
            <button
              className="align-middle rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-label="Account"
              aria-haspopup="true"
            >
              <UserCircleIcon className="w-8 h-8" />
            </button>
            {isProfileMenuOpen && (
              <ul
                className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
                aria-label="submenu"
              >
                <li className="flex">
                  <Link
                    to="/profile"
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <UserCircleIcon className="w-4 h-4 mr-3" />
                    <span>Profile</span>
                  </Link>
                </li>
                {token && (
                  <li className="flex">
                    <button
                      onClick={logoutUser}
                      className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                      <span>Log out</span>
                    </button>
                  </li>
                )}
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
