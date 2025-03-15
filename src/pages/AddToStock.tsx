import { Sidebar, InputWithLabel } from "../components";
import { HiOutlineSave } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import SimpleInput from "../components/SimpleInput";
import SelectInput from "../components/SelectInput";
import { useState, useEffect } from "react";
import productApi from "../utils/api/productApi";
import purchaseReceiptApi from "../utils/api/purchaseReceiptsApi"; // API lưu purchase receipt

interface Product {
  productID: number;
  name: string;
  brand: string;
  description: string;
  imageURL: string;
  nameAlias: string;
  categoryID: number;
  category: {
    id: number;
    name: string;
    products: string[];
  };
  productSizes: {
    productSizeID: number;
    size: number;
    stockQuantity: number;
    realQuantity: number;
    productID: number;
    orderItems: {
      orderItemID: number;
      quantity: number;
      orderID: number;
      productSizeID: number;
    }[];
    productPrices: {
      id: number;
      createdAt: string;
      startDate: string;
      endDate: string;
      productSizeId: number;
      sellingPrice: number;
      productPriceStatus: number;
      description: string;
      productSize: string;
    }[];
    product: string;
  }[];
}

const suppliers = [
  { id: 1, name: "Nike Vietnam" },
  { id: 2, name: "Adidas Vietnam" },
];

const AddToStock: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentType, setPaymentType] = useState("cash"); // Mặc định cash

  const [selectedProducts, setSelectedProducts] = useState<{
    product: Product;
    size: number | "";
    price: number;
    quantity: number;
    supplierId: number;
  }[]>([]);
  const [sizeError, setSizeError] = useState<string | null>(null); // State for size error
  const totalPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProducts();
        setProducts(response);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = (product: Product) => {
    if (!product.productSizes || product.productSizes.length === 0) {
      setSizeError(`Product "${product.name}" does not have any sizes available.`);
      return;
    }

    // 🛠 Kiểm tra xem sản phẩm đã tồn tại hay chưa (cho phép nếu chưa chọn size)
    const isDuplicate = selectedProducts.some(
      (item) => item.product.productID === product.productID && item.size !== ""
    );

    if (isDuplicate) {
      setSizeError(`Product "${product.name}" is already in the list. Please select a different size.`);
      return;
    }

    setSizeError(null);

    setSelectedProducts([
      ...selectedProducts,
      {
        product,
        size: "", // Ban đầu không ép buộc chọn size
        price: 0,  // Chưa có size nên chưa có giá
        quantity: 0,
        supplierId: 1,
      },
    ]);
  };




  const handleSupplierChange = (index: number, supplierId: number) => {
    setSelectedProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, supplierId } : p))
    );
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, price: newPrice } : item
      )
    );
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    setSelectedProducts((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleSubmitStock = async () => {
    const hasInvalidSize = selectedProducts.some((item) => item.size === "");

    if (hasInvalidSize) {
      alert("Please select a size for all products before submitting.");
      return;
    }

    // Tạo transactionID giả (hoặc có thể dùng một logic khác để sinh giá trị này)
    const transactionID = "TXN" + new Date().getTime();

    const purchaseReceipt = {
      dateTime: new Date().toISOString(),
      totalPrice: totalPrice,
      status: 1, // Mặc định là 1
      paymentType: paymentType,
      transactionID: transactionID,
      supplierId: 1,
      details: selectedProducts.map((item) => {
        const selectedProductSize = item.product.productSizes.find((size) => size.size === item.size);
        return {
          productSizeID: selectedProductSize?.productSizeID || 0,
          quantity: item.quantity,
          unit: "piece",
          rawPrice: item.price,
        };
      }),
    };
    try {
      const response = await purchaseReceiptApi.create(purchaseReceipt);
      console.log("Purchase Receipt Saved:", response);
      alert("Stock entry submitted successfully!");
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error submitting stock:", error);
      alert("Failed to submit stock entry.");
    }
  };
  const handleSizeChange = (index: number, newSize: number) => {
    // 🛠 Kiểm tra nếu size đã tồn tại cho sản phẩm khác
    const isSizeDuplicate = selectedProducts.some(
      (item, i) =>
        i !== index &&
        item.product.productID === selectedProducts[index].product.productID &&
        item.size === newSize
    );

    if (isSizeDuplicate) {
      alert("This size is already selected for this product. Please choose another size.");
      return;
    }

    setSelectedProducts((prev) =>
      prev.map((p, i) => {
        if (i === index) {
          const selectedSize = p.product.productSizes.find((size) => size.size === newSize);

          return {
            ...p,
            size: newSize,
            stockQuantity: selectedSize ? selectedSize.stockQuantity : 0,
            price: selectedSize?.productPrices?.[0]?.sellingPrice || 0,
          };
        }
        return p;
      })
    );
  };



  return (
    <div className="h-auto border-t border-blackSecondary flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full py-10">
        <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
            Add to Stock
          </h2>
          <button
            onClick={handleSubmitStock}
            className="dark:bg-whiteSecondary bg-blackPrimary w-auto px-6 py-2 text-lg flex items-center justify-center gap-x-2 dark:hover:bg-white hover:bg-blackSecondary duration-200"
          >
            <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
            <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
              Submit Stock Entry
            </span>
          </button>
        </div>

        <div className="flex gap-6 p-6">
          {/* Danh sách sản phẩm đã chọn */}
          <div className="w-2/3 bg-gray-100 p-4 rounded-md dark:bg-gray-800">
            {selectedProducts.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">Stock Entry List</h3>
                <table className="w-full border">
                  <thead>
                    <tr>
                      <th className="border p-2">Product Name</th>
                      <th className="border p-2">Size</th>
                      <th className="border p-2">Quantity</th>
                      <th className="border p-2">Price</th>
                      <th className="border p-2">Supplier</th>
                      <th className="border p-2">Payment Type</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.product.name}</td>
                        <td className="border p-2">
                          <SelectInput
                            selectList={[
                              { label: "Select a size", value: "" },
                              ...item.product.productSizes.map((size) => ({
                                label: size.size.toString(),
                                value: size.size.toString(),
                              })),
                            ]}
                            value={item.size.toString()}
                            onChange={(e) => handleSizeChange(index, Number(e.target.value))}
                          />
                        </td>
                        <td className="border p-2">
                          <SimpleInput
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                            className="w-full text-center"
                          />
                        </td>                        
                        <td className="border p-2">
                          <SimpleInput
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                            className="w-full text-center"
                          />
                        </td>
                        <td className="border p-2">
                          <SelectInput
                            selectList={suppliers.map((supplier) => ({
                              label: supplier.name,
                              value: supplier.id.toString(),
                            }))}
                            value={item.supplierId.toString()}
                            onChange={(e) => handleSupplierChange(index, Number(e.target.value))}
                          />
                        </td>
                        <td className="border p-2 text-center">
                          <SelectInput
                            selectList={[
                              { label: "Cash", value: "cash" },
                              { label: "VNPay", value: "vnpay" },
                              { label: "PayPal", value: "paypal" },
                            ]}
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
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

                    {/* Hiển thị tổng giá của tất cả sản phẩm đã chọn */}
                    <tr>
                      <td colSpan={3} className="border p-2 text-right font-bold">
                        Total Price:
                      </td>
                      <td colSpan={4} className="border p-2 font-bold">
                        {totalPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                    </tr>
                  </tbody>


                </table>
              </div>
            ) : (
              <p className="text-gray-500">No products added.</p>
            )}
            {sizeError && <p className="text-red-500 mt-4">{sizeError}</p>}
          </div>

          {/* Danh sách sản phẩm để thêm vào */}
          <div className="w-1/3 bg-gray-200 p-4 rounded-md dark:bg-gray-700">
            <InputWithLabel label="Search Product">
              <SimpleInput
                type="text"
                placeholder="Enter product name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </InputWithLabel>
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
      </div>
    </div>
  );
};

export default AddToStock;
