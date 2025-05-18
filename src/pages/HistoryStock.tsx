import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockHistoryByProductSizeIdAndPeriod } from "../redux/actions/historyStockAction";
import { RootState, AppDispatch } from "../store";
import Sidebar from "../components/Sidebar";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineFilter, HiOutlineCalendar, HiOutlineSearch } from "react-icons/hi";
import { MdOutlineInventory2, MdHistory } from "react-icons/md";

const ITEMS_PER_PAGE = 5;

const HistoryStock = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stockHistory = useSelector((state: RootState) => state.historyStock);

  const [filters, setFilters] = useState({
    productSizeId: "",
    startDate: "",
    endDate: "",
  });

  const [applyFilter, setApplyFilter] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (applyFilter) {
      if (filters.productSizeId && filters.startDate && filters.endDate) {
        dispatch(fetchStockHistoryByProductSizeIdAndPeriod({
          productSizeId: Number(filters.productSizeId),
          startDate: new Date(filters.startDate),
          endDate: new Date(filters.endDate),
        }));
        setError(""); 
      } else {
        setError("Please fill in all filter fields");
      }
      setApplyFilter(false); 
    }
  }, [applyFilter, dispatch, filters]);

  const handleApplyFilter = () => {
    if (filters.productSizeId && filters.startDate && filters.endDate) {
      setApplyFilter(true);
      setError(""); 
    } else {
      setError("Please fill in all filter fields");
    }
  };

  const totalPages = Math.ceil(stockHistory.filtered.length / ITEMS_PER_PAGE);

  const paginatedData = stockHistory.filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [stockHistory.filtered]);

  return (
    <div className="h-auto flex dark:bg-gray-900 bg-gray-50">
      <Sidebar />
      <div className="dark:bg-gray-900 bg-gray-50 w-full min-h-screen">
        {/* Header */}
        <div className="p-6 lg:px-8 border-b dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-800">
              Stock History
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 lg:px-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Records */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                  <MdHistory className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stockHistory.filtered.length}</p>
                </div>
              </div>
            </div>
            
            {/* Inventory Movement */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                  <MdOutlineInventory2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Stock Change</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stockHistory.filtered.reduce((total, item) => total + (item.stockChange || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                <HiOutlineFilter className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Filter Records
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Size ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={filters.productSizeId}
                      onChange={(e) => setFilters((p) => ({ ...p, productSizeId: e.target.value }))}
                      placeholder="Enter ID"
                      className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
                      className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
                      className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-1 flex items-end">
                  <button
                    onClick={handleApplyFilter}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              {stockHistory.error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{stockHistory.error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stock History Records</h3>
            </div>
            
            <div className="p-5">
              {stockHistory.loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {paginatedData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product Size ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Change</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {paginatedData.map((item) => (
                            <tr key={item.stockHistoryID} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                #{item.stockHistoryID}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {new Date(item.updatedDateTime).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {item.productSizeID}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.stockChange > 0 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                    : item.stockChange < 0 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {item.stockChange > 0 ? '+' : ''}{item.stockChange}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300" 
                                  dangerouslySetInnerHTML={{ __html: item.note || "N/A" }}>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="text-gray-500 dark:text-gray-400">
                        <p className="mb-1">No stock history records found</p>
                        <p className="text-sm">Try adjusting your filters or select a different date range</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center h-8 w-8 rounded-md ${
                          currentPage === 1 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <HiOutlineChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center h-8 w-8 rounded-md ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <HiOutlineChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryStock;