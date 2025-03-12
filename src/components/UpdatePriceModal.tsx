import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductSizes } from "../redux/actions/productSizeAction";
import { AppDispatch, RootState } from "../store";
import productApi from "../utils/api/productApi";
import { ProductPriceCreateDto } from "../utils/api/productPriceApi";

interface UpdatePriceModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  existingPrice: ProductPriceCreateDto | null;
  onUpdatePrice: (updatedPrice: ProductPriceCreateDto) => void;
}

const UpdatePriceModal: React.FC<UpdatePriceModalProps> = ({
  isModalOpen,
  closeModal,
  existingPrice,
  onUpdatePrice,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productSizes } = useSelector((state: RootState) => state.productSize);

  const [priceData, setPriceData] = useState<ProductPriceCreateDto>({
    startDate: "",
    endDate: "",
    productSizeId: 0,
    sellingPrice: 0,
    description: "",
  });

  const [productName, setProductName] = useState<string>("Loading...");

  useEffect(() => {
    dispatch(getAllProductSizes());
  }, [dispatch]);

  // Load existing price data into state when the modal opens
  useEffect(() => {
    if (existingPrice) {
      setPriceData(existingPrice);

      // Fetch product name for the selected size
      const fetchProductName = async () => {
        try {
          const product = await productApi.getProductById(existingPrice.productSizeId);
          setProductName(`${existingPrice.productSizeId} - ${product.name}`);
        } catch (error) {
          console.error(`Error fetching product name:`, error);
          setProductName(`${existingPrice.productSizeId} - Unknown`);
        }
      };

      fetchProductName();
    }
  }, [existingPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPriceData((prev) => ({
      ...prev,
      [name]: name === "sellingPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    onUpdatePrice(priceData);
    closeModal();
  };

  if (!isModalOpen || !existingPrice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-11/12 max-w-md rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Update Product Price</h2>
        </div>
        <div className="p-6">
          {/* Product Size (Read-Only) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Product Size</label>
            <input
              type="text"
              value={productName}
              disabled
              className="border rounded-lg px-3 py-2 w-full text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700"
            />
          </div>

          <div className="mb-4 flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={priceData.startDate || ""}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">End Date</label>
              <input
                type="date"
                name="endDate"
                value={priceData.endDate || ""}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 w-full text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Selling Price</label>
            <input
              type="number"
              name="sellingPrice"
              value={priceData.sellingPrice}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
              placeholder="Enter Selling Price"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-white">Description</label>
            <textarea
              name="description"
              value={priceData.description}
              onChange={handleInputChange}
              className="border rounded-lg px-3 py-2 w-full text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-700"
              placeholder="Enter description"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
          <button
            className="px-4 py-2 text-white text-sm font-medium rounded-lg transition bg-gray-500 hover:bg-gray-600"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-white text-sm font-medium rounded-lg transition bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
          >
            Update Price
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePriceModal;
