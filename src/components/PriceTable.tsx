import React, { useEffect, useState } from "react";
import { ProductPrice } from "../utils/api/productPriceApi";
import Spinder from "./Spinder";

interface PriceTableProps {
  products: ProductPrice[];
}

const PriceTable: React.FC<PriceTableProps> = ({ products }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

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

  if (isLoading) {
    return <Spinder />;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-md mt-3">
      <table className="w-full border-collapse bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-left">Selling Price</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="min-h-[250px]">
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-4">{product.id}</td>
                <td className="p-4">{product.description}</td>
                <td className="p-4">${product.sellingPrice.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                      product.productPriceStatus === 2
                        ? "bg-yellow-300 text-yellow-800"
                        : "bg-green-300 text-green-800"
                    }`}
                  >
                    {product.productPriceStatus === 2 ? "Pending" : "Active"}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleApproveClick(product.id)}
                    className={`px-4 py-2 rounded-lg text-white font-medium ${
                      product.productPriceStatus === 2
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 cursor-not-allowed"
                    }`}
                    disabled={product.productPriceStatus !== 2}
                  >
                    {product.productPriceStatus === 2 ? "Approve" : "Inactive"}
                  </button>

                  <button
                    onClick={() => handleRejectClick(product.id)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No product prices available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PriceTable;
