import {
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineSearch,
} from "react-icons/hi";
import {
  Pagination,
  RowsPerPage,
  Sidebar,
  UserTable,
  WhiteButton,
} from "../components";
import { AiOutlineExport } from "react-icons/ai";
import { useEffect, useState } from "react";
import userApi from "../utils/api/userApi";

const Users = () => {
  const [users, setUsers] = useState([]); // All users data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const rowsPerPage = 10; // Users per page

  // Calculate total pages
  const totalPages = Math.ceil(users.length / rowsPerPage);

  // Get paginated data
  const paginatedUsers = users
    .filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    })
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await userApi.getUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleExportCSV = async () => {
    try {
      const response = await fetch("https://lthshop.azurewebsites.net/api/Customers/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "customers.csv"; // Tên file tải xuống
      document.body.appendChild(a);
      a.click();
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                All users
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>All users</span>
              </p>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2"
                onClick={handleExportCSV}
              >
                <AiOutlineExport className="dark:text-whiteSecondary text-blackPrimary text-base" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Export
                </span>
              </button>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Display users */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <UserTable users={paginatedUsers} />
          )}
          {/* Pagination */}
          <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`border border-gray-600 py-1 px-3 ${
                      currentPage === page
                        ? "dark:bg-whiteSecondary bg-blackPrimary dark:text-blackPrimary text-whiteSecondary"
                        : "dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary"
                    } hover:border-gray-500`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
