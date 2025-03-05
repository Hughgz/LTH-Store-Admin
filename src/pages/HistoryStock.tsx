import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockHistoryByProductSizeId, fetchStockHistoryByPeriod } from "../redux/actions/historyStockAction";
import { RootState, AppDispatch } from "../store";
import Sidebar from "../components/Sidebar";

const ITEMS_PER_PAGE = 5;

const HistoryStock = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stockHistory = useSelector((state: RootState) => state.historyStock);
  
  const [filters, setFilters] = useState({
    productSizeId: "",
    fromDate: "",
    toDate: "",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [applyFilter, setApplyFilter] = useState(false);

  useEffect(() => {
    if (applyFilter) {
      if (filters.fromDate && filters.toDate) {
        dispatch(fetchStockHistoryByPeriod({
          productSizeId: Number(filters.productSizeId),
          fromDate: filters.fromDate,
          toDate: filters.toDate,
        }));
      } else {
        dispatch(fetchStockHistoryByProductSizeId(Number(filters.productSizeId)));
      }
      setApplyFilter(false);
    }
  }, [applyFilter, dispatch, filters]);

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
            <button
              onClick={() => setApplyFilter(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Filter
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default HistoryStock;
