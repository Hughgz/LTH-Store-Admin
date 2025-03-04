import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const ITEMS_PER_PAGE = 5;

const HistoryStock = () => {
  const [filters, setFilters] = useState({
    productSizeId: "",
    fromDate: "",
    toDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  interface StockHistoryItem {
    StockHistoryID: number;
    UpdatedDateTime: string;
    ProductSizeID: number;
    StockChange: number;
    Note?: string;
  }
  
  const [stockHistory, setStockHistory] = useState<{ data: StockHistoryItem[]; loading: boolean }>({ data: [], loading: false });

  const fetchStockHistory = async () => {
    if (!filters.productSizeId || !filters.fromDate || !filters.toDate) return;
    setStockHistory((prev) => ({ ...prev, loading: true }));
    try {
      const response = await fetch(
        `http://localhost:5000/api/StockHistories?productSizeId=${filters.productSizeId}&fromDate=${filters.fromDate}&toDate=${filters.toDate}`
      );
      const data = await response.json();
      setStockHistory({ data, loading: false });
    } catch (error) {
      console.error("Error fetching stock history:", error);
      setStockHistory((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStockHistory();
  }, [filters]);

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
              onChange={(e) => setFilters((p) => ({ ...p, productSizeId: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters((p) => ({ ...p, fromDate: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters((p) => ({ ...p, toDate: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
            />
          </div>

          {stockHistory.loading ? (
            <p className="text-center">Loading...</p>
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
                    paginatedData.map((item, index) => (
                      <tr key={`${item.StockHistoryID}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-opacity opacity-100">
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

export default HistoryStock;