import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Để điều hướng giữa các trang
import Sidebar from "../components/Sidebar";

const RecommendPurchase = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [date, setDate] = useState<string>(""); // State lưu ngày được chọn
  const [formError, setFormError] = useState<string | null>(null);
  const [showDate, setShowDate] = useState<string | null>(null); // State để lưu ngày đã chọn
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set()); // Lưu các item được chọn

  // Tải dữ liệu từ localStorage khi trang được load
  useEffect(() => {
    const storedDate = localStorage.getItem("selectedDate");
    const storedRecommendations = localStorage.getItem("recommendations");

    if (storedDate) {
      setShowDate(storedDate);
    }

    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    }
  }, []);

  const fetchRecommendations = async () => {
    if (!date) {
      setFormError("Please select a valid date.");
      return;
    }

    const selectedDate = new Date(date);
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      setFormError("Prediction date must be later than today.");
      return;
    }

    console.log("Before API call - Selected Date:", date);

    setLoading(true);
    setErrorMessage(null);
    setFormError(null);
    setShowDate(date);

    try {
      const response = await axios.post("http://localhost:8000/recommend_purchase", {
        start_date: date,
        end_date: date,
      });

      setRecommendations(response.data.recommendations);
      localStorage.setItem("selectedDate", date);
      localStorage.setItem("recommendations", JSON.stringify(response.data.recommendations));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setErrorMessage("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImportToStock = () => {
    const selectedRecommendations = recommendations.filter((_, index) => selectedItems.has(index));

    if (selectedRecommendations.length === 0) {
      setErrorMessage("Please select at least one product to import.");
      return;
    }

    navigate("/products/import", { state: { selectedRecommendations } });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === recommendations.length) {
      // Bỏ chọn tất cả
      setSelectedItems(new Set());
    } else {
      // Chọn tất cả
      setSelectedItems(new Set(recommendations.map((_, index) => index)));
    }
  };

  const handleSelectItem = (index: number) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(index)) {
      newSelectedItems.delete(index);
    } else {
      newSelectedItems.add(index);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleReset = () => {
    setDate("");
    setRecommendations([]);
    setShowDate(null);
    setFormError(null);
    setErrorMessage(null);
    setSelectedItems(new Set());

    localStorage.removeItem("selectedDate");
    localStorage.removeItem("recommendations");
  };

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Purchase Recommendations</h1>

          {/* Form nhập ngày */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Chỉ cho phép chọn ngày sau ngày hôm nay
              className="border rounded-lg px-3 py-2 w-1/3"
            />
          </div>

          {/* Nút gửi yêu cầu */}
          <button
            onClick={fetchRecommendations}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-4"
          >
            Get Recommendations
          </button>

          {/* Nút reset */}
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Reset
          </button>

          {/* Hiển thị lỗi nếu có */}
          {formError && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {formError}
            </div>
          )}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          {/* Hiển thị loading */}
          {loading && <div className="mt-4 text-gray-500">Loading recommendations...</div>}

          {/* Hiển thị "Recommend for {date}" */}
          {showDate && !loading && (
            <div className="mt-4 text-lg text-gray-800 dark:text-white">
              <strong>Recommend for {showDate}</strong>
            </div>
          )}

          {/* Hiển thị các khuyến nghị mua hàng */}
          {recommendations.length > 0 && !loading && (
            <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
              <div className="flex justify-between mb-4 pr-[3.5rem]">
                {/* Nút "Import Selected" nằm bên trái */}
                <button
                  onClick={handleImportToStock}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Import to Stock
                </button>

                {/* Nút "Select All" nằm bên phải */}
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                >
                  {selectedItems.size === recommendations.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <table className="w-full border-collapse bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <th className="p-4 text-left">Product Name</th>
                    <th className="p-4 text-left">Size</th>
                    <th className="p-4 text-left">Recommended Quantity</th>
                    <th className="p-4 text-left">Purchase Cost</th>
                    <th className="p-4 text-left">Select</th> {/* Cột Select di chuyển */}
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((recommendation, index) => (
                    <tr key={index}>
                      <td className="p-4 text-left">{recommendation.ProductName}</td>
                      <td className="p-4 text-left">{recommendation.Size}</td>
                      <td className="p-4 text-left pl-[6.5rem]">{recommendation.RecommendedQuantity}</td>
                      <td className="p-4 text-left">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(recommendation.PurchaseCost)}
                      </td>
                      <td className="p-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(index)}
                          onChange={() => handleSelectItem(index)}
                          className="w-6 h-6"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendPurchase;