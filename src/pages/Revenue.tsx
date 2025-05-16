import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRevenue, fetchRevenueByPeriod } from "../redux/actions/revenueActions";
import { processRevenueData } from "../redux/reducers/revenueSlice";
import { RootState, AppDispatch } from "../store";
import Sidebar from "../components/Sidebar";
import axios from "axios";

interface PredictedRevenueItem {
  date: string;
  predicted_revenue_vnd: number;
}

const ITEMS_PER_PAGE = 5;

const Revenue = () => {
  const dispatch = useDispatch<AppDispatch>();
  const revenue = useSelector((state: RootState) => state.revenue);

  const [filters, setFilters] = useState({
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    filterType: "day",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [predictedRevenue, setPredictedRevenue] = useState<number | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showPredictionForm, setShowPredictionForm] = useState(false);

  const [predictionParams, setPredictionParams] = useState({
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    order_count: 1,
    item_count: 1,
    period: "day", // Default to day
  });

  const [formError, setFormError] = useState<string | null>(null);

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
    setCurrentPage(1);
  }, [revenue.data, filters.filterType, dispatch]);

  const totalPages = Math.ceil(revenue.filtered.length / ITEMS_PER_PAGE);
  const paginatedData = revenue.filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePeriodChange = (newPeriod: string) => {
    const selectedDate = new Date(predictionParams.start_date);
    let dateRange = "";

    switch (newPeriod) {
      case "week":
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Set to Monday
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Sunday
        dateRange = `${startOfWeek.toISOString().split("T")[0]} to ${endOfWeek.toISOString().split("T")[0]}`;
        break;

      case "month":
        const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0); // Last day of the month
        dateRange = `${startOfMonth.toISOString().split("T")[0]} to ${endOfMonth.toISOString().split("T")[0]}`;
        break;

      case "quarter":
        const quarter = Math.floor((selectedDate.getMonth() + 3) / 3);
        const startOfQuarter = new Date(selectedDate.getFullYear(), (quarter - 1) * 3, 1);
        const endOfQuarter = new Date(selectedDate.getFullYear(), quarter * 3, 0); // End date of the quarter
        dateRange = `${startOfQuarter.toISOString().split("T")[0]} to ${endOfQuarter.toISOString().split("T")[0]}`;
        break;

      default:
        dateRange = selectedDate.toISOString().split("T")[0];
        break;
    }

    setPredictionParams((prevParams) => ({
      ...prevParams,
      period: newPeriod,
      dateRange: dateRange,
    }));
  };

  const fetchPredictedRevenue = async () => {
    try {
      setLoadingPrediction(true);
      setErrorMessage(null);
      setFormError(null);
  
      // Tính toán date range dựa trên period
      let start_date: string;
      let end_date: string;
  
      const selectedDate = new Date(predictionParams.start_date); // sử dụng start_date đã được chọn
  
      switch (predictionParams.period) {
        case "week":
          const startOfWeek = new Date(selectedDate);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Tính ngày bắt đầu tuần
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6); // Tính ngày kết thúc tuần
          start_date = startOfWeek.toISOString().split("T")[0];
          end_date = endOfWeek.toISOString().split("T")[0];
          break;
  
        case "month":
          const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 2); // Tính ngày bắt đầu tháng
          const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1); // Tính ngày kết thúc tháng
          start_date = startOfMonth.toISOString().split("T")[0];
          end_date = endOfMonth.toISOString().split("T")[0];
          break;
  
        case "quarter":
          const quarter = Math.floor((selectedDate.getMonth() + 3) / 3); // Tính quý
          const startOfQuarter = new Date(selectedDate.getFullYear(), (quarter - 1) * 3, 2); // Tính ngày bắt đầu quý
          const endOfQuarter = new Date(selectedDate.getFullYear(), quarter * 3, 1); // Tính ngày kết thúc quý
          start_date = startOfQuarter.toISOString().split("T")[0];
          end_date = endOfQuarter.toISOString().split("T")[0];
          break;
  
        case "day":
          // Nếu "day", lấy toàn bộ khoảng thời gian từ start_date đến end_date
          start_date = predictionParams.start_date;
          end_date = predictionParams.end_date;
          break;
  
        default:
          start_date = selectedDate.toISOString().split("T")[0]; // Nếu không phải các trường hợp trên, sử dụng ngày đã chọn
          end_date = selectedDate.toISOString().split("T")[0];
          break;
      }
  
      console.log("Calculated Date Range:", start_date, "to", end_date); // In ra kết quả để kiểm tra
  
      // Kiểm tra các tham số trước khi gửi yêu cầu
      console.log("Sending request with parameters:", {
        start_date,
        end_date,
        order_count: predictionParams.order_count,
        item_count: predictionParams.item_count,
      });
  
      // Kiểm tra dữ liệu đầu vào
      if (!start_date || !end_date || predictionParams.order_count <= 0 || predictionParams.item_count <= 0) {
        setFormError("Please fill in all fields correctly.");
        return;
      }
  
      // Gửi yêu cầu API với các tham số đã tính toán
      const response = await axios.post("http://localhost:8000/predict_revenue", {
        start_date,
        end_date,
        order_count: predictionParams.order_count,
        item_count: predictionParams.item_count,
      });
  
      // Kiểm tra phản hồi từ API
      console.log("API Response:", response.data);
  
      if (response.data && response.data.predictions) {
        const predictions = response.data.predictions;
        console.log("Predictions data:", predictions);
  
        // Cập nhật dữ liệu dự báo
        setPredictedRevenue(predictions);
      } else {
        setErrorMessage("No predictions found in the response.");
      }
  
    } catch (error) {
      console.error("Error fetching predicted revenue:", error);
      setErrorMessage("Failed to fetch predicted revenue. Please try again.");
      setPredictedRevenue(null);
    } finally {
      setLoadingPrediction(false);
    }
  };
  
  

  const handleShowPredictionForm = () => {
    setShowPredictionForm((prev) => {
      if (prev) {
        setPredictedRevenue(null);
      }
      return !prev;
    });
  };

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Revenue Analytics</h1>

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
              className={`px-4 py-2 border rounded-lg ${filters.filterType === "day" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
            >
              Daily
            </button>
            <button
              onClick={() => setFilters((p) => ({ ...p, filterType: "month" }))}
              className={`px-4 py-2 border rounded-lg ${filters.filterType === "month" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
            >
              Monthly
            </button>

            <button
              onClick={handleShowPredictionForm}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-auto"
            >
              Predict Revenue
            </button>
          </div>

          <div className="flex gap-x-6 mb-6">
            {showPredictionForm && (
              <div className="p-4 border border-gray-300 rounded-lg w-1/2">
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">Start Date</label>
                  <input
                    type="date"
                    value={predictionParams.start_date}
                    onChange={(e) => setPredictionParams({ ...predictionParams, start_date: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">End Date</label>
                  <input
                    type="date"
                    value={predictionParams.end_date}
                    onChange={(e) => setPredictionParams({ ...predictionParams, end_date: e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">Order Count</label>
                  <input
                    type="number"
                    value={predictionParams.order_count}
                    onChange={(e) => setPredictionParams({ ...predictionParams, order_count: +e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">Item Count</label>
                  <input
                    type="number"
                    value={predictionParams.item_count}
                    onChange={(e) => setPredictionParams({ ...predictionParams, item_count: +e.target.value })}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">Prediction Period</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handlePeriodChange("day")}
                      className={`px-4 py-2 border rounded-lg ${predictionParams.period === "day" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      Day
                    </button>
                    <button
                      onClick={() => handlePeriodChange("week")}
                      className={`px-4 py-2 border rounded-lg ${predictionParams.period === "week" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => handlePeriodChange("month")}
                      className={`px-4 py-2 border rounded-lg ${predictionParams.period === "month" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => handlePeriodChange("quarter")}
                      className={`px-4 py-2 border rounded-lg ${predictionParams.period === "quarter" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      Quarter
                    </button>
                  </div>
                </div>
                <button
                  onClick={fetchPredictedRevenue}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Predict
                </button>
                {formError && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {formError}
                  </div>
                )}
              </div>
            )}

            {loadingPrediction && (
              <div className="mb-4 p-4 bg-black-100 pl-[15.5rem] text-black rounded flex items-center justify-center">
                Loading prediction...
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}

            {predictedRevenue !== null && !loadingPrediction && !errorMessage && (
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded w-1/2">
                <h2 className="text-xl font-semibold text-center text-black">PREDICTION TABLE</h2>
                <div className="flex justify-between mb-2 font-semibold">
                  <span className="text-lg">Predict Date</span>
                  <span className="text-lg">Predict Revenue</span>
                </div>
                <ul className="list-disc ml-6 mt-2">
                  {Array.isArray(predictedRevenue) && predictedRevenue.slice((currentPage - 1) * 10, currentPage * 10).map((item: PredictedRevenueItem, index: number) => (
                    <li key={index} className="flex justify-between text-lg">
                      <span>{new Date(item.date).toLocaleDateString("en-US")}</span>
                      <span>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.predicted_revenue_vnd)}
                      </span>
                    </li>
                  ))}
                </ul>

                {Array.isArray(predictedRevenue) && predictedRevenue.length > 10 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-500 text-white"}`}
                    >
                      Previous
                    </button>

                    <span className="text-gray-700 dark:text-gray-300 text-lg">
                      Page {currentPage} of {Math.ceil(predictedRevenue.length / 10)}
                    </span>

                    <button
                      disabled={currentPage === Math.ceil(predictedRevenue.length / 10)}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className={`px-4 py-2 rounded-lg border ${currentPage === Math.ceil(predictedRevenue.length / 10) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-500 text-white"}`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Existing Revenue Table */}
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <th className="p-4 text-left text-xl">Date</th>
                  <th className="p-4 text-left text-xl">Revenue</th>
                </tr>
              </thead>
              <tbody className="min-h-[250px]">
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
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.amount)}
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

          {/* Total Revenue */}
          <div className="mt-6 flex justify-end items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg">
            <span className="text-lg font-semibold text-gray-700 dark:text-white mr-4 text-xl">
              Total Revenue:
            </span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(revenue.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
