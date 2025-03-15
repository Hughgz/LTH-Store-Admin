import React from "react";

interface ProductSize {
  size: string;
  price: number;
  quantity: number;
}

interface Product {
  productID: string;
  name: string;
  imageURL: string;
  brand: string;
  productSizes: ProductSize[];
}

interface ProductDetailModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedProduct: Product | null;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isModalOpen,
  closeModal,
  selectedProduct,
}) => {
  if (!isModalOpen || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-11/12 max-w-lg rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Product Details</h2>
          <button className="text-gray-600 hover:text-gray-800" onClick={closeModal}>
            ✖
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-6">
          {/* Hình ảnh sản phẩm */}
          <div className="flex justify-center mb-4">
            <img
              src={selectedProduct.imageURL}
              alt={selectedProduct.name}
              className="w-48 h-48 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Thông tin sản phẩm */}
          <div className="mb-4">
            <p className="text-sm"><strong className="text-gray-800">Product ID:</strong> {selectedProduct.productID}</p>
            <p className="text-sm"><strong className="text-gray-800">Name:</strong> {selectedProduct.name}</p>
            <p className="text-sm"><strong className="text-gray-800">Brand:</strong> {selectedProduct.brand}</p>
          </div>

          {/* Danh sách kích thước */}
          <div className="max-h-48 overflow-y-auto">
            <table className="table-auto w-full text-left border-collapse bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium">Size</th>
                  <th className="px-4 py-3 text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-sm font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.productSizes.map((size, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 text-sm text-gray-800">{size.size}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {size.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{size.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
          <button className="px-4 py-2 text-white text-sm font-medium rounded-lg transition bg-gray-500 hover:bg-gray-600" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
