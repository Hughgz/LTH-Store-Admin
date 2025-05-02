import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  fetchAllPendingProductPrices,
  createNewProductPrice,
  approveProductPrice,
} from "../redux/reducers/productPriceSlice";
import { HiOutlinePlus, HiOutlineChevronRight, HiOutlineSearch } from "react-icons/hi";
import Sidebar from "../components/Sidebar";
import PriceTable from "../components/PriceTable";
import AddProductPrice from "../components/AddProductPrice";

const ProductManage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingProductPrices, status, error } = useSelector((state: RootState) => state.productPrices);

  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5; // Number of rows per page
  const [viewMode, setViewMode] = useState<"list" | "add">("list"); // View mode: list or add

  useEffect(() => {
    dispatch(fetchAllPendingProductPrices());
  }, [dispatch]);

  // Filter prices based on search term and paginate
  const filteredPrices = pendingProductPrices.filter((price) =>
    price.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate the filtered prices
  const totalPages = Math.ceil(filteredPrices.length / rowsPerPage);
  const paginatedPrices = filteredPrices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle pagination change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                {viewMode === "list" ? "Product Prices Pending Approval" : "Add Product Prices"}
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span> <HiOutlineChevronRight className="text-lg" />
                <span>Product Prices</span>
              </p>
            </div>
            <div className="flex gap-x-2">
              {viewMode === "list" ? (
                <button
                  onClick={() => setViewMode("add")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <HiOutlinePlus className="inline mr-2" /> Add Price
                </button>
              ) : (
                <button
                  onClick={() => setViewMode("list")}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Back to List
                </button>
              )}
            </div>
          </div>

          {/* Display content based on view mode */}
          {viewMode === "list" ? (
            <>
              {/* Search */}
              <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
                <div className="relative">
                  <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
                  <input
                    type="text"
                    className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
                    placeholder="Search prices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Price Table */}
              {status === "loading" ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <PriceTable products={paginatedPrices}/>
              )}

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  Previous
                </button>

                <span className="text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <AddProductPrice onCancel={() => setViewMode("list")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManage;
