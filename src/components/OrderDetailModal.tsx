import React from "react";

// Định nghĩa kiểu dữ liệu cho prop của modal
interface OrderItem {
  product: {
    imageURL: string;
    name: string;
  };
  productSize: {
    size: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  orderID: string;
  dateTime: string;
  status: string;
  orderItems?: OrderItem[]; // Make orderItems optional
}

interface OrderDetailModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedOrder: Order | null;
}


const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isModalOpen,
  closeModal,
  selectedOrder,
}) => {
  // Kiểm tra nếu không có đơn hàng được chọn
  if (!isModalOpen || !selectedOrder) return null;

  // Hàm định dạng ngày/giờ
  const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString("en-US");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-11/12 max-w-3xl rounded-lg shadow-lg overflow-hidden transform transition-all">
        {/* Header Modal */}
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
        </div>

        {/* Nội dung Modal */}
        <div className="p-6">
          {/* Thông tin đơn hàng */}
          <div className="mb-4">
            <p className="text-sm">
              <strong className="text-gray-800">Order ID:</strong> {selectedOrder.orderID}
            </p>
            <p className="text-sm">
              <strong className="text-gray-800">Order Date:</strong> {formatDateTime(selectedOrder.dateTime)}
            </p>
            <p className="text-sm">
              <strong className="text-gray-800">Status:</strong> {selectedOrder.status}
            </p>
          </div>

          {/* Bảng chi tiết sản phẩm */}
          <div className="max-h-64 overflow-y-auto">
            <table className="table-auto w-full text-left border-collapse bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium">Product</th>
                  <th className="px-6 py-3 text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-sm font-medium">Size</th>
                  <th className="px-6 py-3 text-sm font-medium">Quantity</th>
                  <th className="px-6 py-3 text-sm font-medium">Unit Price</th>
                  <th className="px-6 py-3 text-sm font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems?.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-6 py-3">
                      <img
                        src={item.product.imageURL}
                        alt={item.product.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">{item.product.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{item.productSize.size}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{item.quantity}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {item.productSize.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {(item.quantity * item.productSize.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
          <button
            className="px-4 py-2 text-white text-sm font-medium rounded-lg transition bg-blue-600 hover:bg-blue-700"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
