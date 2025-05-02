import React, { useState } from "react";

interface ProductSize {
  size: string;
  price: number;
  quantity: number;
  realQuantity: number;
  stockQuantity: number;
  productSizeId: number;
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

interface PriceData {
  sellingPrice: number;
  productPriceStatus: number;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isModalOpen,
  closeModal,
  selectedProduct,
}) => {
  if (!isModalOpen || !selectedProduct) return null;

  // Sử dụng một đối tượng để lưu trữ giá và trạng thái cho từng productSizeId
  const [priceDataMap, setPriceDataMap] = useState<{ [key: number]: PriceData }>({});

  const handleProductPrice = async (productSizeId: number) => {
    try {
      console.log("Fetching data for productSizeId:", productSizeId); // Debug
      const response = await fetch(`http://localhost:5049/api/ProductPrices/${productSizeId}`);
      const data = await response.json();
      console.log("API Response:", data); // Debug

      if (data && data.sellingPrice !== undefined && data.productPriceStatus !== undefined) {
        // Cập nhật dữ liệu vào priceDataMap
        setPriceDataMap((prev) => ({
          ...prev,
          [productSizeId]: {
            sellingPrice: data.sellingPrice,
            productPriceStatus: data.productPriceStatus,
          },
        }));
      } else {
        console.error("Price data not found");
      }
    } catch (error) {
      console.error("Error fetching product price data:", error);
    }
  };

  // Hàm chuyển đổi productPriceStatus thành chuỗi
  const getStatusString = (status: number) => {
    switch (status) {
      case 0:
        return "Active";
      case 1:
        return "Inactive";
      case 2:
        return "Pending";
      case 3:
        return "Reject";
      default:
        return "Unknown";
    }
  };

  console.log("Price Data Map:", priceDataMap); // Debug

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
                  <th className="px-4 py-3 text-sm font-medium">Real Quantity</th>
                  <th className="px-4 py-3 text-sm font-medium">Stock Quantity</th>
                  <th className="px-4 py-3 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.productSizes.map((size) => {
                  const priceData = priceDataMap[size.productSizeId];
                  return (
                    <tr
                      key={size.productSizeId}
                      className="border-t cursor-pointer"
                      onClick={() => handleProductPrice(size.productSizeId)} // Gọi hàm khi nhấp vào hàng
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">{size.size}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {priceData ? priceData.sellingPrice : "Loading..."}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">{size.realQuantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{size.stockQuantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {priceData ? getStatusString(priceData.productPriceStatus) : "Loading..."}
                      </td>
                    </tr>
                  );
                })}
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