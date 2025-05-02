import { HiLogin, HiOutlineHome, HiUserGroup, HiOutlineChevronDown } from "react-icons/hi";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { HiOutlineTruck, HiOutlineX, HiOutlineUser } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSidebar } from "../features/dashboard/dashboardSlice";
import { useAuth } from "../utils/hooks/useAuth";

const Sidebar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const { isSidebarOpen } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();
  const { token, logoutUser } = useAuth();
  const navigate = useNavigate();

  const sidebarClass: string = isSidebarOpen ? "sidebar-open" : "sidebar-closed";

  const navActiveClass: string =
    "block dark:bg-whiteSecondary flex items-center self-stretch gap-4 py-4 px-6 cursor-pointer max-xl:py-3 dark:text-blackPrimary bg-white text-blackPrimary";
  const navInactiveClass: string =
    "block flex items-center self-stretch gap-4 py-4 px-6 dark:bg-blackPrimary dark:hover:bg-blackSecondary cursor-pointer max-xl:py-3 dark:text-whiteSecondary hover:bg-white text-blackPrimary bg-whiteSecondary";

  // Hàm logout
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="relative">
      <div
        className={`w-72 h-[100vh] dark:bg-blackPrimary bg-whiteSecondary pt-6 xl:sticky xl:top-0 xl:z-10 max-xl:fixed max-xl:top-0 max-xl:z-10 xl:translate-x-0 ${sidebarClass}`}
      >
        <HiOutlineX
          className="dark:text-whiteSecondary text-blackPrimary text-2xl ml-auto mb-2 mr-2 cursor-pointer xl:py-3"
          onClick={() => dispatch(setSidebar())}
        />
        <div>
          {/* Dashboard */}
          <NavLink
            to="/"
            className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
          >
            <HiOutlineHome className="text-xl" />
            <span className="text-lg">Dashboard</span>
          </NavLink>

          {/* Products Dropdown */}
          <div
            onClick={() => setIsProductOpen(!isProductOpen)}
            className="block flex items-center justify-between self-stretch gap-4 py-4 px-6 dark:bg-blackPrimary dark:hover:bg-blackSecondary cursor-pointer max-xl:py-3 dark:text-whiteSecondary hover:bg-white text-blackPrimary bg-whiteSecondary"
          >
            <div className="flex items-center gap-4">
              <HiOutlineDevicePhoneMobile className="text-xl" />
              <span className="text-lg">Products</span>
            </div>
            <HiOutlineChevronDown className={`text-lg transition-transform ${isProductOpen ? "rotate-180" : ""}`} />
          </div>

          {isProductOpen && (
            <div className="pl-8">
              <NavLink
                to="/products/import"
                className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
              >
                Add to Stock
              </NavLink>
              <NavLink
                to="/products/confirmStock"
                className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
              >
                Confirm Stock
              </NavLink>
              <NavLink
                to="/products"
                className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
              >
                Export Product List
              </NavLink>
              <NavLink
                to="/products/historyStock"
                className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
              >
                History Stock
              </NavLink>

              <NavLink
                to="/products/price-manage"
                className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
              >
                Price Product
              </NavLink>

              <NavLink
                to="/products/historyPrice"
                className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
              >
                History Price
              </NavLink>

            </div>
          )}
          
          {/* Revenue */}
          <NavLink
            to="/revenue"
            className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
          >
            <HiOutlineTruck className="text-xl" />
            <span className="text-lg">Revenue</span>
          </NavLink>

          {/* Users */}
          <NavLink
            to="/users"
            className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
          >
            <HiOutlineUser className="text-xl" />
            <span className="text-lg">Users</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
          >
            <HiOutlineTruck className="text-xl" />
            <span className="text-lg">Orders</span>
          </NavLink>

          {/* Auth */}
          <div
            onClick={() => setIsAuthOpen(!isAuthOpen)}
            className="block flex items-center self-stretch gap-4 py-4 px-6 dark:bg-blackPrimary dark:hover:bg-blackSecondary cursor-pointer max-xl:py-3 dark:text-whiteSecondary hover:bg-white text-blackPrimary bg-whiteSecondary"
          >
            <HiUserGroup className="text-xl" />
            <span className="text-lg">Auth</span>
          </div>

          {isAuthOpen && (
            <div>
              {token ? (
                <div onClick={handleLogout} className={navInactiveClass}>
                  <HiLogin className="text-xl" />
                  <span className="text-lg">Logout</span>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={(isActiveObj) => (isActiveObj.isActive ? navActiveClass : navInactiveClass)}
                >
                  <HiLogin className="text-xl" />
                  <span className="text-lg">Login</span>
                </NavLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
