import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRevenue, fetchRevenueByPeriod } from "../redux/actions/revenueActions";
import { processRevenueData } from "../redux/reducers/revenueSlice";
import { RootState, AppDispatch } from "../store";
import Sidebar from "../components/Sidebar";

const ITEMS_PER_PAGE = 5;

const Revenue = () => {
  const dispatch = useDispatch<AppDispatch>();
  const revenue = useSelector((state: RootState) => state.revenue);
  
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    filterType: "day",
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (filters.fromDate && filters.toDate) {
      if (new Date(filters.fromDate) > new Date(filters.toDate)) {
        return;
      }
      dispatch(fetchRevenueByPeriod(filters));
    } else {
      dispatch(fetchAllRevenue());
    }
  }, [filters, dispatch]);

  useEffect(() => {
    dispatch(processRevenueData({ data: revenue.data, filterType: filters.filterType }));
    setCurrentPage(1); // Reset trang khi dữ liệu thay đổi
  }, [revenue.data, filters.filterType, dispatch]);

  // Tính toán số trang
  const totalPages = Math.ceil(revenue.filtered.length / ITEMS_PER_PAGE);

  // Lấy dữ liệu hiển thị trên trang hiện tại
  const paginatedData = revenue.filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Revenue Analytics</h1>

          {/* Bộ lọc ngày */}
          <div className="flex flex-wrap gap-4 mb-6">
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
              onClick={() => setFilters((p) => ({ ...p, filterType: "day" }))}
              className={`px-4 py-2 border rounded-lg ${
                filters.filterType === "day" ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setFilters((p) => ({ ...p, filterType: "month" }))}
              className={`px-4 py-2 border rounded-lg ${
                filters.filterType === "month" ? "bg-blue-500 text-white" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {revenue.error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {revenue.error}
            </div>
          )}

          {/* Bảng hiển thị doanh thu */}
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody className="min-h-[250px]"> {/* Đặt chiều cao tối thiểu để tránh layout thay đổi */}
                {revenue.loading ? (
                  <tr>
                    <td colSpan={2} className="p-4 text-center">
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
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr key={`${item.date}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-opacity opacity-100">
                      <td className="p-4">{item.date}</td>
                      <td className="p-4 text-blue-600 dark:text-blue-400 font-semibold">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-gray-500">
                      No data available for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
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
                  currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Hiển thị tổng doanh thu */}
          <div className="mt-6 flex justify-end items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg">
            <span className="text-lg font-semibold text-gray-700 dark:text-white mr-4">
              Total Revenue:
            </span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenue.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
