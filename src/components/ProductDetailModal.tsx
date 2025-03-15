import React, { useState } from "react";

interface ProductSize {
  size: string;
  price: number;
  quantity: number;
  realQuantity: number; // Added realQuantity
  stockQuantity: number; // Added stockQuantity
  productSizeId: number; // Added productSizeId
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

  const [sellingPrice, setSellingPrice] = useState<number | null>(null);
  const [productPriceStatus, setProductPriceStatus] = useState<string | null>(null);

  const handleProductPrice = async (productSizeId: number) => {
    try {
      // Fetching the price data
      const response = await fetch(`http://localhost:5049/api/ProductPrices/${productSizeId}`);
      const data = await response.json();

      if (data && data.sellingPrice !== undefined) {
        setSellingPrice(data.sellingPrice); // Set the selling price
      } else {
        console.error("Price data not found");
        setSellingPrice(0); // Set to a default value if price is missing
      }

      // Fetch the product price status
      if (data && data.productPriceStatus !== undefined) {
        let priceStatus = "";

        switch (data.productPriceStatus) {
          case 0:
            priceStatus = "Active";
            break;
          case 1:
            priceStatus = "Inactive";
            break;
          case 2:
            priceStatus = "Pending";
            break;
          case 3:
            priceStatus = "Reject";
            break;
          default:
            priceStatus = "Unknown";
            break;
        }

        setProductPriceStatus(priceStatus);
      } else {
        console.error("Price status not found");
        setProductPriceStatus("Unknown");
      }

    } catch (error) {
      console.error("Error fetching product price data:", error);
      setSellingPrice(0);
      setProductPriceStatus("Unknown");
    }
  };
console.log("Selling price", sellingPrice);
console.log("Status", productPriceStatus);
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
                {selectedProduct.productSizes.map((size) => (
                  <tr
                    key={size.productSizeId}
                    className="border-t"
                    onClick={() => handleProductPrice(size.productSizeId)} // Trigger price fetch on click
                  >
                    <td className="px-4 py-3 text-sm text-gray-800">{size.size}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {sellingPrice}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{size.realQuantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{size.stockQuantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {productPriceStatus}
                    </td>
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
