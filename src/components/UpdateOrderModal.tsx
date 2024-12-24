import React, { FC, useState } from "react";

interface ModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  orderId: string | null;
  currentStatus: string; // Truyền trạng thái hiện tại của order
}

const UpdateOrderModal: FC<ModalProps> = ({ isModalOpen, closeModal, orderId, currentStatus }) => {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId) {
      alert("Invalid order ID.");
      return;
    }

    try {
      const response = await fetch(`https://lthshop.azurewebsites.net/api/Orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        alert("Order status updated successfully.");
        closeModal();
        window.location.reload();
      } else {
        alert("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (!isModalOpen) return null;

  // Danh sách trạng thái, loại bỏ trạng thái hiện tại
  const statusOptions = ["Pending", "Processing", "Shipping", "Delivered", "Cancelled"].filter(
    (option) => option !== currentStatus
  );

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow w-1/3">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Update Status</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-900">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <label htmlFor="status" className="block mb-2 text-sm">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select status</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="mt-4 w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Status
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrderModal;
