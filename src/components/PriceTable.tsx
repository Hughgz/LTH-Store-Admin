import React, { useEffect, useState } from "react";
import { ProductPrice } from "../utils/api/productPriceApi";
import { formatPrice } from "../utils/formatters";
import { HiOutlineCheck, HiOutlineX, HiOutlineClock, HiOutlineCurrencyDollar } from "react-icons/hi";
import { MdOutlineMoneyOff } from "react-icons/md";

interface PriceTableProps {
  products: ProductPrice[];
}

const PriceTable: React.FC<PriceTableProps> = ({ products }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleApproveClick = async (productPriceId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5049/api/ProductPrices/approve/${productPriceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve product price");
      }
      console.log("Product price approved successfully:", response);
      alert("Product price approved successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error approving product price:", error);
      alert("Failed to approve product price. Please try again.");
    }
  };

  const handleRejectClick = async (productPriceId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5049/api/ProductPrices/reject/${productPriceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject product price");
      }
      console.log("Product price rejected successfully:", response);
      alert("Product price rejected successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting product price:", error);
      alert("Failed to reject product price. Please try again.");
    }
  };

  // Calculate summary stats
  const pendingPrices = products.filter(p => p.productPriceStatus === 2).length;
  const activePrices = products.filter(p => p.productPriceStatus === 1).length;
  
  const totalProducts = products.length;
  const averagePrice = products.length > 0 
    ? products.reduce((sum, p) => sum + p.sellingPrice, 0) / products.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Price Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Prices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-5 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
              <HiOutlineCurrencyDollar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Prices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
            </div>
          </div>
        </div>
        
        {/* Pending Prices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-5 flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mr-4">
              <HiOutlineClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingPrices}</p>
            </div>
          </div>
        </div>
        
        {/* Active Prices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-5 flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
              <HiOutlineCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activePrices}</p>
            </div>
          </div>
        </div>
        
        {/* Average Price */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-5 flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
              <MdOutlineMoneyOff className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(averagePrice)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Price List</h3>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Selling Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{product.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {product.description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-semibold">
                        {formatPrice(product.sellingPrice)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {product.productPriceStatus === 2 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            <HiOutlineClock className="mr-1 h-3 w-3" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <HiOutlineCheck className="mr-1 h-3 w-3" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveClick(product.id)}
                            disabled={product.productPriceStatus !== 2}
                            className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md ${
                              product.productPriceStatus === 2
                                ? "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 border-transparent"
                                : "text-gray-500 bg-gray-100 border-gray-300 dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600 cursor-not-allowed"
                            }`}
                          >
                            <HiOutlineCheck className={`mr-1.5 h-4 w-4 ${product.productPriceStatus === 2 ? "text-white" : "text-gray-400"}`} />
                            {product.productPriceStatus === 2 ? "Approve" : "Approved"}
                          </button>
                          
                          <button
                            onClick={() => handleRejectClick(product.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
                          >
                            <HiOutlineX className="mr-1.5 h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <p className="text-base font-medium">No price data available</p>
                        <p className="text-sm mt-1">There are no product prices to display</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceTable;
