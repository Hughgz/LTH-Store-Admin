import { Sidebar, InputWithLabel } from "../components";
import { HiOutlineSave, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePlusSm, HiOutlineSearch } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import SimpleInput from "../components/SimpleInput";
import SelectInput from "../components/SelectInput";
import { useState, useEffect } from "react";
import productApi from "../utils/api/productApi";
import purchaseReceiptApi from "../utils/api/purchaseReceiptsApi";
import { useLocation } from "react-router-dom"; 
import { formatPrice } from "../utils/formatters";
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

const PRODUCTS_PER_PAGE = 5;

const AddToStock: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentType, setPaymentType] = useState("cash"); // Mặc định cash
  const location = useLocation();
  const importedRecommendations = location.state?.selectedRecommendations || [];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

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
        setProducts(response as Product[]);
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
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  
  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
  const handleSizeChange = (index: number, newSizeValue: string) => {
    // Treat empty string as empty selection
    if (newSizeValue === "") {
      setSelectedProducts((prev) =>
        prev.map((p, i) => (i === index ? { ...p, size: "" } : p))
      );
      return;
    }

    // Convert to number for normal size values
    const newSize = Number(newSizeValue);
    
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

  useEffect(() => {
    if (importedRecommendations.length > 0) {
      const newProducts = importedRecommendations
        .map((item: any) => {
          // Tìm sản phẩm đầy đủ từ danh sách products
          const fullProduct = products.find((p) => p.name === item.ProductName);
  
          if (!fullProduct) {
            return null;
          }
  
          return {
            product: fullProduct,
            size: item.Size,
            price: item.PurchaseCost,
            quantity: item.RecommendedQuantity,
            supplierId: 1, // Giá trị mặc định
          };
        })
        .filter((p: any) => p !== null);
  
      setSelectedProducts((prev) => {
        const existingProducts = new Set(
          prev.map((p) => `${p.product.productID}-${p.size}`)
        );
  
        const filteredNewProducts = (newProducts as any[]).filter(
          (p) => !existingProducts.has(`${p.product.productID}-${p.size}`)
        );
  
        return [...prev, ...filteredNewProducts];
      });
    }
  }, [importedRecommendations, products]);

  return (
    <div className="h-auto flex dark:bg-blackPrimary bg-gray-50">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-gray-50 w-full min-h-screen">
        {/* Header */}
        <div className="p-6 lg:px-8 border-b dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-800">
              Add to Stock
            </h2>
            <button
              onClick={handleSubmitStock}
              disabled={selectedProducts.length === 0}
              className={`bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-x-2 transition shadow-md ${
                selectedProducts.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <HiOutlineSave className="text-xl" />
              <span>Submit Stock Entry</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Products Selector - Right Panel */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Catalog</h3>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <SimpleInput
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                {/* Product List */}
                <div className="p-5">
                  {loading ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4 pr-1">
                        {paginatedProducts.length > 0 ? (
                          paginatedProducts.map((product) => (
                            <div
                              key={product.productID}
                              onClick={() => handleAddProduct(product)}
                              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
                              </div>
                              <div className="flex-shrink-0">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                                  <HiOutlinePlusSm className="h-4 w-4" />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No products found matching "{searchTerm}"</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Pagination Controls */}
                      {filteredProducts.length > PRODUCTS_PER_PAGE && (
                        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center h-8 w-8 rounded-md ${
                              currentPage === 1 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <HiOutlineChevronLeft className="h-5 w-5" />
                          </button>
                          
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {filteredProducts.length > 0 ? (
                              <span>
                                Page {currentPage} of {totalPages}
                              </span>
                            ) : (
                              <span>0 products</span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`flex items-center justify-center h-8 w-8 rounded-md ${
                              currentPage === totalPages || totalPages === 0
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <HiOutlineChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Selected Products - Left Panel */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stock Entry List</h3>
                </div>
                
                <div className="p-5">
                  {selectedProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {selectedProducts.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {item.product.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <div className="flex flex-col gap-1">
                                  <SelectInput
                                    selectList={[
                                      { label: "Select size", value: "" },
                                      ...item.product.productSizes.map((size) => ({
                                        label: `Size ${size.size}`,
                                        value: size.size.toString(),
                                      })),
                                    ]}
                                    value={item.size === "" ? "" : item.size.toString()}
                                    onChange={(e) => handleSizeChange(index, e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                                  />
                                  {/* {item.size !== "" && (
                                    <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded">
                                      Size {item.size}
                                    </div>
                                  )} */}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <SimpleInput
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                  className="w-20 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <SimpleInput
                                  type="number"
                                  min="0"
                                  value={item.price}
                                  onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                                  className="w-24 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <SelectInput
                                  selectList={suppliers.map((supplier) => ({
                                    label: supplier.name,
                                    value: supplier.id.toString(),
                                  }))}
                                  value={item.supplierId.toString()}
                                  onChange={(e) => handleSupplierChange(index, Number(e.target.value))}
                                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <SelectInput
                                  selectList={[
                                    { label: "Cash", value: "cash" },
                                    { label: "VNPay", value: "vnpay" },
                                    { label: "PayPal", value: "paypal" },
                                  ]}
                                  value={paymentType}
                                  onChange={(e) => setPaymentType(e.target.value)}
                                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                <button
                                  onClick={() => handleRemoveProduct(index)}
                                  className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/30 transition"
                                >
                                  <MdDelete className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                              Total Price:
                            </td>
                            <td colSpan={4} className="px-4 py-3 font-semibold text-lg text-green-600 dark:text-green-400">
                              {formatPrice(totalPrice)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="text-gray-500 dark:text-gray-400">
                        <p className="mb-1">No products added to stock entry</p>
                        <p className="text-sm">Select products from the catalog to add them to your stock entry</p>
                      </div>
                    </div>
                  )}
                  
                  {sizeError && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 text-sm">{sizeError}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Section - only show if there are selected products */}
              {selectedProducts.length > 0 && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stock Entry Summary</h3>
                  </div>
                  
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Size Selected Card */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                          Size Selected
                        </h4>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                          {selectedProducts.map(p => p.size).join(", ")}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {selectedProducts.filter(p => p.size !== "").length} with size selected
                        </p>
                      </div>
                      {/* Total Products Card */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                          Total Products
                        </h4>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                          {selectedProducts.length}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          {selectedProducts.filter(p => p.size !== "").length} with size selected
                        </p>
                      </div>
                      
                      {/* Total Items Card */}
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                        <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                          Total Quantity
                        </h4>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                          {selectedProducts.reduce((sum, item) => sum + item.quantity, 0)}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          items to be added to stock
                        </p>
                      </div>
                      
                      {/* Total Price Card */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                        <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                          Total Price
                        </h4>
                        <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                          {formatPrice(totalPrice)}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          {paymentType === 'cash' ? 'Cash payment' : 
                           paymentType === 'vnpay' ? 'VNPay payment' : 'PayPal payment'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Supplier Breakdown */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Supplier Breakdown</h4>
                      <div className="space-y-3">
                        {suppliers.map(supplier => {
                          const supplierProducts = selectedProducts.filter(item => item.supplierId === supplier.id);
                          const supplierTotal = supplierProducts.reduce((sum, item) => sum + item.price, 0);
                          
                          if (supplierProducts.length === 0) return null;
                          
                          return (
                            <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-white">{supplier.name}</h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {supplierProducts.length} product{supplierProducts.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900 dark:text-white">{formatPrice(supplierTotal)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {Math.round(supplierTotal / totalPrice * 100)}% of total
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>          
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToStock;
