import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineFilter, HiOutlineSearch, HiOutlineCalendar, HiOutlineDocumentDownload } from "react-icons/hi";
import { MdOutlineAttachMoney, MdHistory, MdOutlineLocalOffer } from "react-icons/md";
import { formatPrice } from "../utils/formatters";

interface ProductPrice {
  id: number;
  createdAt: string;
  startDate: string;
  endDate: string;
  productSizeId: number;
  sellingPrice: number;
  productPriceStatus: string;
  description: string;
  productName?: string;
  size?: string;
  brand?: string;
}

const HistoryPrice = () => {
  const [productPrices, setProductPrices] = useState<ProductPrice[]>([]);
  const [productSizeId, setProductSizeId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsAndSizes, setProductsAndSizes] = useState<{ name: string; size: string; id: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const rowsPerPage = 5;
  const visiblePageCount = 3;

  const totalPages = Math.ceil(productPrices.length / rowsPerPage);
  const startPage = Math.max(Math.min(currentPage - 1, totalPages - visiblePageCount + 1), 1);
  const endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedOrders = productPrices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Fetch product prices, product sizes, and product names
  const fetchPrices = async () => {
    try {
      if (!productSizeId) {
        alert("Please select a Product Size");
        return;
      }
      
      setIsLoading(true);
      
      const response = await fetch(`http://localhost:5049/api/ProductPrices/all-product-price/${productSizeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Product Prices");
      }
      const data = await response.json();

      const updatedData = await Promise.all(
        data.map(async (price: ProductPrice) => {
          const sizeResponse = await fetch(`http://localhost:5049/api/ProductSizes/${price.productSizeId}`);
          const sizeData = await sizeResponse.json();

          const productResponse = await fetch(`http://localhost:5049/api/Products/${sizeData.productID}`);
          const productData = await productResponse.json();

          return {
            ...price,
            productName: productData.name,
            size: sizeData.size,
            brand: productData.brand,
          };
        })
      );

      setProductPrices(updatedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductNamesAndSizes = async () => {
    try {
      const response = await fetch("http://localhost:5049/api/Products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const products = await response.json();

      const sizesResponse = await fetch("http://localhost:5049/api/ProductSizes");
      if (!sizesResponse.ok) {
        throw new Error("Failed to fetch product sizes");
      }
      const sizes = await sizesResponse.json();

      const productSizeData = sizes.map((size: any) => ({
        name: products.find((product: any) => product.productID === size.productID)?.name,
        size: size.size,
        id: size.productSizeID,
      }));

      setProductsAndSizes(productSizeData);
    } catch (error) {
      console.error("Error fetching product names and sizes: ", error);
    }
  };

  useEffect(() => {
    fetchProductNamesAndSizes();
  }, []);

  useEffect(() => {
    if (productSizeId) {
      fetchPrices();
    }
  }, [productSizeId]);


  const filteredProductsAndSizes = searchTerm
    ? productsAndSizes.filter((item) =>
    (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof item.size === 'string' && item.size.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    : [];  // Nếu searchTerm trống, không hiển thị

  // Calculate summary stats
  const activePrices = productPrices.filter(p => p.productPriceStatus === "0").length;
  const pendingPrices = productPrices.filter(p => p.productPriceStatus === "2").length;
  const totalProducts = productPrices.length;
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === "0") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          Active
        </span>
      );
    } else if (status === "1") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          Inactive
        </span>
      );
    } else if (status === "2") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          Rejected
        </span>
      );
    }
  };

  return (
    <div className="h-auto flex dark:bg-gray-900 bg-gray-50">
      <Sidebar />
      <div className="dark:bg-gray-900 bg-gray-50 w-full min-h-screen">
        {/* Header */}
        <div className="p-6 lg:px-8 border-b dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-800">
              Price History
            </h2>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <HiOutlineDocumentDownload className="mr-2 h-5 w-5" />
              Export Data
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 lg:px-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Prices */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                  <MdHistory className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
                </div>
              </div>
            </div>
            
            {/* Active Prices */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                  <MdOutlineAttachMoney className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Prices</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{activePrices}</p>
                </div>
              </div>
            </div>
            
            {/* Pending Prices */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mr-4">
                  <MdOutlineLocalOffer className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Prices</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingPrices}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                <HiOutlineFilter className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Filter Price History
              </h3>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="w-full sm:w-64">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product & Size
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Search product or size..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {searchTerm && filteredProductsAndSizes.length > 0 && (
                      <div className="absolute mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md border border-gray-200 dark:border-gray-600 max-h-60 overflow-y-auto z-10">
                        <ul className="py-1">
                          {filteredProductsAndSizes.map((item) => (
                            <li
                              key={item.id}
                              onClick={() => {
                                setSearchTerm(`${item.name} - Size ${item.size}`);
                                setProductSizeId(item.id.toString());
                              }}
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-700 dark:text-gray-200 text-sm"
                            >
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Size {item.size}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={fetchPrices}
                  disabled={!productSizeId}
                  className={`px-4 py-2.5 rounded-md text-white text-sm font-medium shadow-sm flex items-center ${
                    productSizeId 
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <HiOutlineFilter className="mr-1.5 h-5 w-5" />
                  Apply Filter
                </button>
              </div>
            </div>
          </div>

          {/* Result Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Price History Records</h3>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center">
                          <div className="text-gray-500 dark:text-gray-400">
                            <p className="text-base font-medium">No price history records found</p>
                            <p className="text-sm mt-1">Try selecting a different product or check your filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((priceHistory) => (
                        <tr key={priceHistory.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            <div className="flex items-center">
                              <HiOutlineCalendar className="mr-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span>{formatDate(priceHistory.createdAt)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {priceHistory.productName || "Unknown Product"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {priceHistory.size || "N/A"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                            {formatPrice(priceHistory.sellingPrice)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            {getStatusBadge(priceHistory.productPriceStatus)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                            {priceHistory.description || "No description"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Pagination Controls */}
            {paginatedOrders.length > 0 && totalPages > 1 && (
              <div className="flex justify-between items-center p-5 border-t border-gray-200 dark:border-gray-700">
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
                
                <div className="flex gap-1">
                  {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center h-8 w-8 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <HiOutlineChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPrice;