import React, { useState } from "react";

interface ModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  productID: string | null;
}

interface SizeData {
  size: string;
  price: string;
  quantity: string;
}

const AddProductSize: React.FC<ModalProps> = ({ isModalOpen, closeModal, productID }) => {
  const [sizeData, setSizeData] = useState<SizeData>({
    size: "",
    price: "",
    quantity: "",
  });

  const handleInputChange = (field: keyof SizeData, value: string) => {
    setSizeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sizeData.size || !sizeData.price || !sizeData.quantity) {
      alert("Please fill out all fields!");
      return;
    }

    const addProductSizeApi = "https://lthshop.azurewebsites.net/api/ProductSizes";

    const newSize = {
      size: parseInt(sizeData.size),
      price: parseFloat(sizeData.price),
      quantity: parseInt(sizeData.quantity),
      productID: parseInt(productID || "0"), // Fall back to 0 if productID is null
    };

    try {
      const response = await fetch(addProductSizeApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSize),
      });

      if (response.ok) {
        alert("Product size added successfully!");
        closeModal();
        window.location.reload();
      } else {
        const result = await response.json();
        console.error("Error adding product size:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg w-1/3 max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Add Product Size</h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-900 text-xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Product ID Field (readonly) */}
          <div>
            <label htmlFor="product-id" className="text-sm font-semibold">
              Product ID
            </label>
            <input
              id="product-id"
              type="text"
              value={productID || ""}
              readOnly
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
          </div>
          {/* Size Field */}
          <div>
            <label htmlFor="product-size" className="text-sm font-semibold">
              Size
            </label>
            <input
              id="product-size"
              type="number"
              placeholder="Enter product size..."
              value={sizeData.size}
              onChange={(e) => handleInputChange("size", e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* Price Field */}
          <div>
            <label htmlFor="product-price" className="text-sm font-semibold">
              Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="Enter product price..."
              value={sizeData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* Quantity Field */}
          <div>
            <label htmlFor="product-quantity" className="text-sm font-semibold">
              Quantity
            </label>
            <input
              id="product-quantity"
              type="number"
              placeholder="Enter product quantity..."
              value={sizeData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Size
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductSize;
