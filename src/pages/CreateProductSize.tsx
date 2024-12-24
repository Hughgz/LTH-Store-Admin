import React, { useState } from "react";
import { AiOutlineSave } from "react-icons/ai";

interface ModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  productID: string | null;
}

const AddProductSize: React.FC<ModalProps> = ({ isModalOpen, closeModal, productID }) => {
  const [sizeData, setSizeData] = useState({
    size: "",
    price: "",
    quantity: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setSizeData({ ...sizeData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      productID: parseInt(productID || ""),
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
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow w-1/3">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Add Product Size</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-900">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          {/* Product ID Field (readonly) */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold">Product ID</label>
            <input
              type="text"
              value={productID}
              readOnly
              className="mt-2 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold">Size</label>
            <input
              type="number"
              placeholder="Enter product size..."
              value={sizeData.size}
              onChange={(e) => handleInputChange("size", e.target.value)}
              className="mt-2 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold">Price</label>
            <input
              type="number"
              placeholder="Enter product price..."
              value={sizeData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="mt-2 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-sm font-semibold">Quantity</label>
            <input
              type="number"
              placeholder="Enter product quantity..."
              value={sizeData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className="mt-2 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <span className="ml-2 font-medium">Save Size</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductSize;
