import React from "react";

interface ProductRequest {
  id: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

interface ApprovedRequestModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedRequest: {
    id: string;
    datetime: string;
    totalAmount: number;
    status: "Pending" | "Confirmed";
    paymentType: string;
    transactionID: string;
    supplierId: number;
    products: ProductRequest[];
  } | null;
  updatedQuantities: { [key: string]: number };
  handleUpdateQuantity: (productId: string, value: number) => void;
  handleConfirmApproval: () => void;
  totalAmountFinal: number;
}

const ApprovedRequestModal: React.FC<ApprovedRequestModalProps> = ({
  isModalOpen,
  closeModal,
  selectedRequest,
  updatedQuantities,
  handleUpdateQuantity,
  handleConfirmApproval,
  
}) => {
  if (!isModalOpen || !selectedRequest) return null;

  // ✅ Tính tổng tiền cuối cùng (totalAmountFinal)
  const totalAmountFinal = selectedRequest.products.reduce(
    (sum, product) =>
      sum + (updatedQuantities[product.id] || product.quantity) * product.unitPrice,
    selectedRequest.totalAmount
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-11/12 max-w-3xl rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Approve Purchase Receipt</h2>
        </div>

        {/* Nội dung */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm"><strong className="text-gray-800">Purchase Receipt ID:</strong> {selectedRequest.id}</p>
            <p className="text-sm"><strong className="text-gray-800">Datetime:</strong> {selectedRequest.datetime}</p>
            <p className="text-sm"><strong className="text-gray-800">Total Amount:</strong> {selectedRequest.totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
            <p className="text-sm"><strong className="text-gray-800">Status:</strong> {selectedRequest.status}</p>
            <p className="text-sm"><strong className="text-gray-800">Payment Type:</strong> {selectedRequest.paymentType}</p>
            <p className="text-sm"><strong className="text-gray-800">Transaction ID:</strong> {selectedRequest.transactionID}</p>
            <p className="text-sm"><strong className="text-gray-800">Supplier ID:</strong> {selectedRequest.supplierId}</p>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="max-h-64 overflow-y-auto">
            <table className="table-auto w-full text-left border-collapse bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium">Product Name</th>
                  <th className="px-6 py-3 text-sm font-medium">Size</th>
                  <th className="px-6 py-3 text-sm font-medium">Quantity</th>
                  <th className="px-6 py-3 text-sm font-medium">Unit Price</th>
                  <th className="px-6 py-3 text-sm font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedRequest.products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-6 py-3 text-sm text-gray-800">{product.productName}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{product.size}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      <input
                        type="number"
                        className="border p-2 w-16 text-center"
                        min="1"
                        value={updatedQuantities[product.id] || product.quantity}
                        onChange={(e) => handleUpdateQuantity(product.id, Number(e.target.value))}
                      />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {product.unitPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {((updatedQuantities[product.id] || product.quantity) * product.unitPrice).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Hiển thị tổng tiền cuối cùng */}
          <div className="mt-4 text-right font-bold text-lg">
            Total Amount Final:{" "}
            <span className="text-green-500">
              {totalAmountFinal.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <button className="px-4 py-2 text-white text-sm font-medium rounded-lg transition bg-gray-500 hover:bg-gray-600" onClick={closeModal}>
            Cancel
          </button>
          <button className="px-4 py-2 text-white text-sm font-medium rounded-lg transition bg-green-600 hover:bg-green-700" onClick={handleConfirmApproval}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovedRequestModal;
