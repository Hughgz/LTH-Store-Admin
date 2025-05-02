import { useEffect, useState } from "react";
import React from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { createNewProductPrice } from "../redux/reducers/productPriceSlice";
import productApi from "../utils/api/productApi";
import SelectInput from "../components/SelectInput";
import SimpleInput from "../components/SimpleInput";
import Spinder from "./Spinder";

interface Product {
  productID: number;
  name: string;
  productSizes: {
    productSizeID: number;
    size: number;
  }[];
}

interface AddProductPriceProps {
  onCancel: () => void;
}

const AddProductPrice: React.FC<AddProductPriceProps> = ({ onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedPrices, setSelectedPrices] = useState<
    { product: Product; size: number | ""; price: number }[] // Đã xóa startDate và endDate
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getProducts();
        setProducts(response);
      } catch (err) {
        setError("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product: Product) => {
    if (!product.productSizes || product.productSizes.length === 0) {
      alert(`Product "${product.name}" does not have any sizes available.`);
      return;
    }

    setSelectedPrices([
      ...selectedPrices,
      { product, size: "", price: 0 }, // Đã xóa startDate và endDate
    ]);
  };

  const handleSizeChange = (index: number, newSizeId: number) => {
    const currentProduct = selectedPrices[index].product;

    // Kiểm tra xem size đã được chọn chưa (tránh trùng lặp size)
    const isDuplicateSize = selectedPrices.some(
      (item, i) =>
        i !== index &&
        item.product.productID === currentProduct.productID &&
        item.size === newSizeId
    );

    if (isDuplicateSize) {
      alert(
        `The size ${newSizeId} is already selected for "${currentProduct.name}". Please choose a different size.`
      );
      return;
    }

    // Cập nhật lại giá trị size trong selectedPrices, lưu productSizeID
    setSelectedPrices((prev) =>
      prev.map((p, i) => (i === index ? { ...p, size: newSizeId } : p))
    );
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    setSelectedPrices((prev) =>
      prev.map((p, i) => (i === index ? { ...p, price: newPrice } : p))
    );
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedPrices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitPrices = async () => {
    if (selectedPrices.some((p) => p.size === "" || p.price <= 0)) {
      alert("Please select a size and enter a valid price for all products.");
      return;
    }

    const pricesToCreate = selectedPrices.map((item) => ({
      productSizeId: item.size,
      sellingPrice: item.price,
      description: `Price for ${item.product.name} - Size ${item.size}`,
    }));

    for (let price of pricesToCreate) {
      try {
        await dispatch(createNewProductPrice(price));
      } catch (error) {
        console.error("Error creating product price:", error);
        alert("Failed to add product price. Please try again.");
        return;
      }
    }
    alert("Product prices added successfully!");
    setSelectedPrices([]); // Clear list after submitting
  };

  if (loading) {
    return <Spinder></Spinder>;
  }
  return (
    <div className="h-auto border-t border-blackSecondary flex dark:bg-blackPrimary bg-whiteSecondary">
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full py-10">
        <div className="flex gap-6 p-6">
          {/* Danh sách sản phẩm đã chọn */}
          <div className="w-2/3 bg-gray-100 p-4 rounded-md dark:bg-gray-800">
            {selectedPrices.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">Price List</h3>
                <table className="w-full border">
                  <thead>
                    <tr>
                      <th className="border p-2">Product Name</th>
                      <th className="border p-2">Size</th>
                      <th className="border p-2">Selling Price</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrices.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.product.name}</td>
                        <td className="border p-2">
                          <SelectInput
                            selectList={[
                              { label: "Select a size", value: "" },
                              ...item.product.productSizes.map((size) => ({
                                label: size.size.toString(), // Hiển thị size (ví dụ: "40")
                                value: size.productSizeID.toString(), // Lưu productSizeID (ví dụ: "1")
                              })),
                            ]}
                            value={item.size.toString()} // Lưu productSizeID
                            onChange={(e) =>
                              handleSizeChange(index, Number(e.target.value))
                            } // Khi chọn, lưu productSizeID
                          />
                        </td>
                        <td className="border p-2">
                          <SimpleInput
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) =>
                              handlePriceChange(index, Number(e.target.value))
                            }
                            className="w-full text-center"
                          />
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            onClick={() => handleRemoveProduct(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No products added.</p>
            )}
          </div>

          {/* Danh sách sản phẩm để thêm vào */}
          <div className="w-1/3 bg-gray-200 p-4 rounded-md dark:bg-gray-700">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 w-full"
            />
            <div className="mt-4">
              {loading ? (
                <p>Loading products...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.productID}
                    onClick={() => handleAddProduct(product)}
                    className="cursor-pointer p-2 bg-white dark:bg-gray-600 rounded-md mb-2 hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    {product.name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 flex justify-end">
          <button
            onClick={handleSubmitPrices}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-3"
          >
            Submit
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPrice;