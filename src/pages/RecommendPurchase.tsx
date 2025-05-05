import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const RecommendPurchase = () => {
  // State để lưu trữ kết quả, lỗi, và trạng thái loading
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const [date, setDate] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);


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

    try {
      const response = await axios.post("http://localhost:8000/recommend_purchase", { date });

      // Log giá trị sau khi nhận kết quả từ API
      console.log("After API call - Recommendations received:", response.data.recommendations);

      setRecommendations(response.data.recommendations); // Lưu kết quả trả về vào state
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setErrorMessage("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
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
              min={new Date().toISOString().split("T")[0]} 
              className="border rounded-lg px-3 py-2 w-1/3"
            />
          </div>

          {/* Nút gửi yêu cầu */}
          <button
            onClick={fetchRecommendations}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Get Recommendations
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

          {/* Hiển thị các khuyến nghị mua hàng */}
          {recommendations.length > 0 && !loading && (
            <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <th className="p-4 text-left">Product Name</th>
                    <th className="p-4 text-left">Size</th>
                    <th className="p-4 text-left">Recommended Quantity</th>
                    <th className="p-4 text-left">Purchase Cost</th>
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
