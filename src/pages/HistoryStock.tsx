import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockHistoryByProductSizeIdAndPeriod } from "../redux/actions/historyStockAction";
import { RootState, AppDispatch } from "../store";
import Sidebar from "../components/Sidebar";

const ITEMS_PER_PAGE = 5;

const HistoryStock = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stockHistory = useSelector((state: RootState) => state.historyStock);

  useEffect(() => {
    console.log("Stock History Data:", stockHistory);
  }, [stockHistory]);

  const [filters, setFilters] = useState({
    productSizeId: "",
    startDate: "",
    endDate: "",
  });

  const [applyFilter, setApplyFilter] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("applyFilter:", applyFilter);
    console.log("filters:", filters);

    if (applyFilter) {
      console.log("Apply Filter is true");
      if (filters.productSizeId && filters.startDate && filters.endDate) {
        console.log("Fetching stock history by period:", filters);
        dispatch(fetchStockHistoryByProductSizeIdAndPeriod({
          productSizeId: Number(filters.productSizeId),
          startDate: new Date(filters.startDate),
          endDate: new Date(filters.endDate),
        }));
        setError(""); 
      } else {
        setError("Need to select enough requirements");
      }
      setApplyFilter(false); 
    }
  }, [applyFilter, dispatch, filters]);

  const handleApplyFilter = () => {
    if (filters.productSizeId && filters.startDate && filters.endDate) {
      setApplyFilter(true);
      setError(""); 
    } else {
      setError("Need to select enough requirements");
    }
  };

  const totalPages = Math.ceil(stockHistory.filtered.length / ITEMS_PER_PAGE);

  const paginatedData = stockHistory.filtered.slice(
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
              type="text"
              value={filters.productSizeId}
              onChange={(e) => setFilters((p) => ({ ...p, productSizeId: e.target.value }))}
              placeholder="Product Size ID"
              className="border rounded-lg px-3 py-2 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
            <button
              onClick={handleApplyFilter} 
              className="px-4 py-2 border rounded-lg bg-gray-500 text-white"
            >
              Apply Filters
            </button>
          </div>

          {/* Hiển thị thông báo lỗi */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {stockHistory.error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {stockHistory.error}
            </div>
          )}

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
              <tbody className="min-h-[250px]">
                {stockHistory.loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"
                            style={{ animationDelay: `${i * 75}ms` }}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ) : stockHistory.error ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-red-500">
                      {stockHistory.error}
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr key={item.stockHistoryID} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-4">{item.stockHistoryID}</td>
                      <td className="p-4">{item.updatedDateTime}</td>
                      <td className="p-4">{item.productSizeID}</td>
                      <td className="p-4">{item.stockChange}</td>
                      <td className="p-4">{item.note || "N/A"}</td>
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

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-500 text-white"}`}
              >
                Previous
              </button>

              <span className="text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-500 text-white"}`}
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

export default HistoryStock;