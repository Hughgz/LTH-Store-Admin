import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockHistoryByProductSizeId, fetchStockHistoryByProductSizeIdAndPeriod } from "../redux/actions/historyStockAction";
import { RootState, AppDispatch } from "../store";
import Sidebar from "../components/Sidebar";

const ITEMS_PER_PAGE = 5;

const StockHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stockHistory = useSelector((state: RootState) => state.historyStock);

  const [filters, setFilters] = useState({
    productSizeId: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [applyFilter, setApplyFilter] = useState(false);

  // Effect to fetch data based on the filters
  useEffect(() => {
    if (applyFilter) {
      if (filters.startDate && filters.endDate) {
        // If both startDate and endDate are provided, call the API with the period filter
        dispatch(fetchStockHistoryByProductSizeIdAndPeriod({
          productSizeId: Number(filters.productSizeId),
          startDate: new Date(filters.startDate),
          endDate: new Date(filters.endDate),
        }));
      } else if (filters.productSizeId) {
        // If only productSizeId is provided, call the API with productSizeId filter
        dispatch(fetchStockHistoryByProductSizeId(Number(filters.productSizeId)));
      }
      setApplyFilter(false); // Reset the apply filter flag after dispatch
    }
  }, [applyFilter, dispatch, filters]);

  // Pagination calculation
  const totalPages = Math.ceil(stockHistory.data.length / ITEMS_PER_PAGE);
  const paginatedData = stockHistory.data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Stock History</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="number"
              placeholder="Product Size ID"
              value={filters.productSizeId}
              onChange={(e) => setFilters({ ...filters, productSizeId: e.target.value })}
              className="border rounded-lg px-3 py-2 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="border rounded-lg px-3 py-2 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="border rounded-lg px-3 py-2 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
            <button
              onClick={() => setApplyFilter(true)} // Trigger filter application
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Filter
            </button>
          </div>

          {stockHistory.loading ? (
            <p className="text-center">Loading...</p>
          ) : stockHistory.error ? (
            <p className="text-center text-red-500">{stockHistory.error}</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <th className="p-4 text-left">Stock History ID</th>
                    <th className="p-4 text-left">Updated Date</th>
                    <th className="p-4 text-left">Product Size ID</th>
                    <th className="p-4 text-left">Stock Change</th>
                    <th className="p-4 text-left">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={item.StockHistoryID} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="p-4">{item.StockHistoryID}</td>
                        <td className="p-4">{new Date(item.UpdatedDateTime).toLocaleString()}</td>
                        <td className="p-4">{item.ProductSizeID}</td>
                        <td className="p-4">{item.StockChange}</td>
                        <td className="p-4">{item.Note || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">
                        No stock history available for the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-500 text-white"
                }`}
              >
                Previous
              </button>

              <span className="text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockHistory;
