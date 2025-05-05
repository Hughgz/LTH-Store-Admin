import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRevenue, fetchRevenueByPeriod } from "../redux/actions/revenueActions";
import { processRevenueData } from "../redux/reducers/revenueSlice";
import { RootState, AppDispatch } from "../store";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const ITEMS_PER_PAGE = 5;
const getFirstAndLastDayOfMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 2);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    fromDate: firstDay.toISOString().split("T")[0],
    toDate: lastDay.toISOString().split("T")[0],
  };
};

const Revenue = () => {
  const dispatch = useDispatch<AppDispatch>();
  const revenue = useSelector((state: RootState) => state.revenue);

  const [filters, setFilters] = useState({
    ...getFirstAndLastDayOfMonth(),
    filterType: "day",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [predictedRevenue, setPredictedRevenue] = useState<number | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showPredictionForm, setShowPredictionForm] = useState(false);

  // Set default date to tomorrow (1 day after current date)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow

  const [predictionParams, setPredictionParams] = useState({
    date: tomorrow.toISOString().split("T")[0],
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

  // Fetch predicted revenue from the API
  const fetchPredictedRevenue = async () => {
    try {
      setLoadingPrediction(true);
      setErrorMessage(null);
      setFormError(null);

      if (!predictionParams.date || predictionParams.order_count <= 0 || predictionParams.item_count <= 0) {
        setFormError("Please fill in all fields correctly.");
        return;
      }

      const selectedDate = new Date(predictionParams.date);
      const currentDate = new Date();
      if (selectedDate <= currentDate) {
        setFormError("Prediction date must be later than today.");
        return;
      }

      let dateRange: string;

      // Depending on the period, calculate the date range for prediction
      switch (predictionParams.period) {
        case "week":
          // Get the start and end date of the week
          const startOfWeek = new Date(selectedDate);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Get the start of the week
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6); // Get the end of the week
          dateRange = `${startOfWeek.toISOString().split("T")[0]} to ${endOfWeek.toISOString().split("T")[0]}`;
          break;

        case "month":
          // Get the start and end date of the month
          const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 2);
          const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
          dateRange = `${startOfMonth.toISOString().split("T")[0]} to ${endOfMonth.toISOString().split("T")[0]}`;
          break;

        case "quarter":
          // Calculate the quarter and get the start and end date of the quarter
          const quarter = Math.floor((selectedDate.getMonth() + 3) / 3); // Get the quarter (1 to 4)
          const startOfQuarter = new Date(selectedDate.getFullYear(), (quarter - 1) * 3, 2);
          const endOfQuarter = new Date(selectedDate.getFullYear(), quarter * 3, 1);
          dateRange = `${startOfQuarter.toISOString().split("T")[0]} to ${endOfQuarter.toISOString().split("T")[0]}`;
          break;

        default:
          // For "day" case, we use the selected date as is
          dateRange = selectedDate.toISOString().split("T")[0];
      }

      console.log("Data sent to API:", { ...predictionParams, dateRange });

      const response = await axios.post("http://localhost:8000/predict_revenue", { ...predictionParams, dateRange });

      setPredictedRevenue(response.data.predicted_revenue_vnd);
    } catch (error) {
      console.error("Error fetching predicted revenue:", error);
      setErrorMessage("Failed to fetch predicted revenue. Please try again.");
      setPredictedRevenue(null);
    } finally {
      setLoadingPrediction(false);
    }
  };

  // Show prediction form when "Predict Revenue" is clicked
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

            {/* Predict Revenue Button */}
            <button
              onClick={handleShowPredictionForm}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-auto"
            >
              Predict Revenue
            </button>
          </div>

          {/* Prediction Form */}
          {showPredictionForm && (
            <div className="mb-6 p-4 border border-gray-300 rounded-lg">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  value={predictionParams.date}
                  onChange={(e) => setPredictionParams({ ...predictionParams, date: e.target.value })}
                  className="border rounded-lg px-3 py-2 w-1/3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">Order Count</label>
                <input
                  type="number"
                  value={predictionParams.order_count}
                  onChange={(e) => setPredictionParams({ ...predictionParams, order_count: +e.target.value })}
                  className="border rounded-lg px-3 py-2 w-1/3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">Item Count</label>
                <input
                  type="number"
                  value={predictionParams.item_count}
                  onChange={(e) => setPredictionParams({ ...predictionParams, item_count: +e.target.value })}
                  className="border rounded-lg px-3 py-2 w-1/3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">Prediction Period</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPredictionParams({ ...predictionParams, period: "day" })}
                    className={`px-4 py-2 border rounded-lg ${predictionParams.period === "day" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setPredictionParams({ ...predictionParams, period: "week" })}
                    className={`px-4 py-2 border rounded-lg ${predictionParams.period === "week" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setPredictionParams({ ...predictionParams, period: "month" })}
                    className={`px-4 py-2 border rounded-lg ${predictionParams.period === "month" ? "bg-gray-500 text-white" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setPredictionParams({ ...predictionParams, period: "quarter" })}
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

          {/* Show Loading or Error Message for Prediction */}
          {loadingPrediction && (
            <div className="text-center text-gray-500">Loading prediction...</div>
          )}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          {/* Predicted Revenue */}
          {predictedRevenue !== null && !loadingPrediction && !errorMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Predicted revenue for {new Date(predictionParams.date).toLocaleDateString("en-US")}:{" "}
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(predictedRevenue)}
            </div>
          )}

          {/* Existing Revenue Table */}
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Revenue</th>
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
            <span className="text-lg font-semibold text-gray-700 dark:text-white mr-4">
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
