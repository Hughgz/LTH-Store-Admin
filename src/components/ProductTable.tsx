import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";  // Import icon Add
import { AddProductSize } from "../pages";

const ProductTable = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addProductSize, setAddProductSize] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleOpenAddProductSizeModal = (productID) => {
    setSelectedProductId(productID);
    setIsModalOpen(true);
  };
  const handleCloseAddProductSizeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };
  const inStockClass =
    "text-green-400 bg-green-400/10 flex-none rounded-full p-1";
  const outOfStockClass =
    "text-rose-400 bg-rose-400/10 flex-none rounded-full p-1";

  return (
    <>
      <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
        <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Product</th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell">Brand</th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell">Sizes</th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20">Price</th>
            <th className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((item) => {
            const sizes = item.productSizes.map((size) => size.size).join(", ");
            const price = item.productSizes[0]?.price || 0; // Display the price of the first size
            const isInStock = item.productSizes.some((size) => size.quantity > 0);

            return (
              <tr key={nanoid()}>
                <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                  <div className="flex items-center gap-x-4">
                    <img
                      src={item.imageURL}
                      alt={item.name}
                      className="h-8 w-8 rounded-full bg-gray-800"
                    />
                    <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                      {item.name}
                    </div>
                  </div>
                </td>
                <td className="py-4 pl-0 pr-4 table-cell pr-8">
                  <div className="flex gap-x-3">
                    <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                      {item.brand}
                    </div>
                  </div>
                </td>
                <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                  <div className="flex items-center gap-x-2 justify-start">
                    <div
                      className={isInStock ? inStockClass : outOfStockClass}
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <div className="dark:text-whiteSecondary text-blackPrimary block">
                      {sizes}
                    </div>
                  </div>
                </td>
                <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium table-cell lg:pr-20">
                  {parseFloat(price).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                  <div className="flex gap-x-1 justify-end">
                    {/* Add Product Button */}
                    <button
                      onClick={() => handleOpenAddProductSizeModal(item.productID)}
                      className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                    >
                      <AiOutlinePlus className="text-lg" />
                    </button>
                    {/* Edit Product Button */}
                    <Link
                      to={`/products/edit/${item.productID}`}
                      className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                    >
                      <HiOutlinePencil className="text-lg" />
                    </Link>
                    {/* View Product Button
                    <Link
                      to={`/products/${item.productID}`}
                      className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                    >
                      <HiOutlineEye className="text-lg" />
                    </Link> */}
                    {/* Delete Product Button */}
                    <button
                      onClick={() => console.log("Delete product", item.productID)}
                      className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                    >
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <AddProductSize
        isModalOpen={isModalOpen}
        closeModal={handleCloseAddProductSizeModal}
        productID={selectedProductId}
      />
    </>
  );
};

export default ProductTable;
