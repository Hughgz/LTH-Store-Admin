import {
  HiLogin,
  HiOutlineHome,
  HiUserGroup,
  HiOutlineChevronDown,
  HiOutlineTruck,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChartBar
} from "react-icons/hi";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { useAuth } from "../utils/hooks/useAuth";
import { IconType } from "react-icons";

// Define NavItem props interface
interface NavItemProps {
  to: string;
  icon: IconType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  hasChildren?: boolean;
  isOpen?: boolean;
}

const Sidebar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const { isSidebarOpen } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();
  const { token, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Check if the current route is active for highlighting
  const isRouteActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Close dropdown menus when sidebar closes
  useEffect(() => {
    if (!isSidebarOpen) {
      setIsAuthOpen(false);
      setIsProductOpen(false);
    }
  }, [isSidebarOpen]);

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Navigation item component for consistent styling
  const NavItem = ({ to, icon, label, isActive, onClick, hasChildren = false, isOpen = false }: NavItemProps) => {
    const Icon = icon;

    return (
      <div className={`relative group ${hasChildren ? '' : ''}`}>
        <NavLink
          to={to}
          className={({ isActive: routeActive }) =>
            `flex items-center justify-between px-5 py-3 rounded-lg mx-3 my-1 transition-all duration-200 ${(isActive || routeActive)
              ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400 font-medium"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`
          }
          onClick={onClick}
        >
          <div className="flex items-center gap-3">
            <Icon className={`text-xl ${(isActive || isRouteActive(to)) ? "text-blue-600 dark:text-blue-400" : ""}`} />
            <span className="text-base tracking-wide">{label}</span>
          </div>
          {hasChildren && (
            <HiOutlineChevronDown
              className={`text-sm transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </NavLink>

        {!hasChildren && (
          <div className={`absolute left-0 w-1 rounded-r-md h-8 top-1/2 -translate-y-1/2 transition-all duration-200 ${(isActive || isRouteActive(to)) ? "bg-blue-600 dark:bg-blue-400" : "bg-transparent group-hover:bg-gray-300 dark:group-hover:bg-gray-700"
            }`} />
        )}
      </div>
    );
  };

  return (
    <aside className="relative">
      <div
        className={`w-72 h-screen bg-white dark:bg-gray-900 shadow-xl transition-all duration-300 flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          xl:translate-x-0 fixed xl:sticky top-0 left-0 z-40 xl:z-0 border-r border-gray-200 dark:border-gray-800`}
      >

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col">
          <div className="mb-2 px-4">
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Main</p>
          </div>

          {/* Dashboard */}
          <NavItem
            to="/"
            icon={HiOutlineHome}
            label="Dashboard"
            isActive={isRouteActive("/")}
          />

          {/* Products */}
          <div className="mb-2 mt-6 px-4">
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Products</p>
          </div>

          <div className="mb-1">
            <div
              onClick={() => setIsProductOpen(!isProductOpen)}
              className={`flex items-center justify-between px-5 py-3 rounded-lg mx-3 my-1 cursor-pointer transition-all duration-200 ${isProductOpen ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <div className="flex items-center gap-3">
                <HiOutlineDevicePhoneMobile className={`text-xl ${isProductOpen ? "text-blue-600 dark:text-blue-400" : ""}`} />
                <span className="text-base tracking-wide">Products</span>
              </div>
              <HiOutlineChevronDown className={`text-sm transition-transform duration-200 ${isProductOpen ? "rotate-180" : ""}`} />
            </div>

            {/* Products Submenu */}
            <div className={`overflow-hidden transition-all duration-300 pl-4 ${isProductOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}>
              <NavLink
                to="/products/import"
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 rounded-lg mx-3 my-1 transition-all text-sm ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`
                }
              >
                <span>Add to Stock</span>
              </NavLink>
              <NavLink
                to="/products/confirmStock"
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 rounded-lg mx-3 my-1 transition-all text-sm ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`
                }
              >
                <span>Confirm Stock</span>
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 rounded-lg mx-3 my-1 transition-all text-sm ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`
                }
              >
                <span>Export Product List</span>
              </NavLink>
              <NavLink
                to="/products/historyStock"
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 rounded-lg mx-3 my-1 transition-all text-sm ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`
                }
              >
                <span>History Stock</span>
              </NavLink>
              <NavLink
                to="/products/price-manage"
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 rounded-lg mx-3 my-1 transition-all text-sm ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`
                }
              >
                <span>Price Product</span>
              </NavLink>
              <NavLink
                to="/products/historyPrice"
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 rounded-lg mx-3 my-1 transition-all text-sm ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`
                }
              >
                <span>History Price</span>
              </NavLink>
              <NavLink
                to="/products/recommendPurchase"
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 rounded-lg mx-3 my-1 transition-all text-sm ${isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`
                }
              >
                <span>Recommend Purchase</span>
              </NavLink>
            </div>
          </div>

          {/* Sales & Analytics */}
          <div className="mb-2 mt-6 px-4">
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Sales & Analytics</p>
          </div>

          <NavItem
            to="/revenue"
            icon={HiOutlineChartBar}
            label="Revenue"
            isActive={isRouteActive("/revenue")}
          />

          <NavItem
            to="/orders"
            icon={HiOutlineTruck}
            label="Orders"
            isActive={isRouteActive("/orders")}
          />

          {/* Users & Access */}
          <div className="mb-2 mt-6 px-4">
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Users & Access</p>
          </div>

          <NavItem
            to="/users"
            icon={HiOutlineUser}
            label="Users"
            isActive={isRouteActive("/users")}
          />

          {/* Auth */}
          <div
            onClick={() => setIsAuthOpen(!isAuthOpen)}
            className={`flex items-center justify-between px-5 py-3 rounded-lg mx-3 my-1 cursor-pointer transition-all duration-200 ${isAuthOpen ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <div className="flex items-center gap-3">
              <HiUserGroup className={`text-xl ${isAuthOpen ? "text-blue-600 dark:text-blue-400" : ""}`} />
              <span className="text-base tracking-wide">Authentication</span>
            </div>
            <HiOutlineChevronDown className={`text-sm transition-transform duration-200 ${isAuthOpen ? "rotate-180" : ""}`} />
          </div>

          {/* Auth Submenu */}
          <div className={`overflow-hidden transition-all duration-300 ${isAuthOpen ? "max-h-[100px] opacity-100" : "max-h-0 opacity-0"
            }`}>
            {token ? (
              <div
                onClick={handleLogout}
                className="flex items-center gap-3 px-5 py-3 rounded-lg mx-3 my-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all"
              >
                <HiOutlineLogout className="text-xl" />
                <span className="text-base">Logout</span>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 rounded-lg mx-3 my-1 transition-all ${isActive ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <HiLogin className="text-xl" />
                <span className="text-base">Login</span>
              </NavLink>
            )}
          </div>
        </nav>        
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 xl:hidden"
          onClick={() => dispatch(setSidebar())}
        />
      )}
    </aside>
  );
};

export default Sidebar;
