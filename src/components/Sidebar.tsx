import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, ShoppingBagIcon, UserGroupIcon, 
  ShoppingCartIcon, ChartBarIcon, QuestionMarkCircleIcon,
  BellIcon, UserCircleIcon, Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon },
  { name: 'Users', href: '/users', icon: UserGroupIcon },
  { name: 'Revenue', href: '/revenue', icon: ChartBarIcon },
  { name: 'Categories', href: '/categories', icon: Cog6ToothIcon },
  { name: 'Help Desk', href: '/help-desk', icon: QuestionMarkCircleIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white dark:bg-gray-800 lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 p-4">
          <Link to="/" className="text-xl font-semibold text-gray-800 dark:text-white">
            Your Logo
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 -mr-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-5 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                  isActive
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-150 ease-in-out ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-white'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
