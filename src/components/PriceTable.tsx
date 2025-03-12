import React, { useState } from "react";
import { ProductPrice } from "../utils/api/productPriceApi";
import UpdatePriceModal from "./UpdatePriceModal";

interface PriceTableProps {
  products: ProductPrice[];
  onApprove: (productPriceId: number) => void;
  onUpdatePrice: (updatedPrice: ProductPrice) => void;
}

const ITEMS_PER_PAGE = 5;

const PriceTable: React.FC<PriceTableProps> = ({ products, onApprove, onUpdatePrice }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Total pages for pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  // Paginated data
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Open UpdatePriceModal with selected product price
  const handleEditClick = (productPrice: ProductPrice) => {
    setSelectedPrice(productPrice);
    setIsEditModalOpen(true);
  };

  // Close modal and reset selectedPrice
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedPrice(null);
  };

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
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                    onClick={() => onApprove(product.id)}
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
                    onClick={() => handleEditClick(product)}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
                  >
                    Edit
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-500 text-white"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* UpdatePriceModal */}
      {isEditModalOpen && selectedPrice && (
        <UpdatePriceModal
          isModalOpen={isEditModalOpen}
          closeModal={handleCloseModal}
          existingPrice={selectedPrice}
          onUpdatePrice={onUpdatePrice}
        />
      )}
    </div>
  );
};

export default PriceTable;
