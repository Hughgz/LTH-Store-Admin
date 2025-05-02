import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";
import { AddProductSize } from "../pages";
import Spinder from "./Spinder";
import ProductDetailModal from "./ProductDetailModal";

interface ProductSize {
  size: string;
  price: number;
  quantity: number;
  realQuantity: number;  // Added realQuantity
  stockQuantity: number; // Added stockQuantity
  productSizeId: number; // Added productSizeId
}

// Updated Product interface
interface Product {
  productID: string;
  name: string;
  imageURL: string;
  brand: string;
  productSizes: ProductSize[]; // Ensure both components use this structure
}

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenAddProductSizeModal = (productID: string) => {
    setSelectedProductId(productID);
    setIsModalOpen(true);
  };

  const handleCloseAddProductSizeModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
  };

  const handleOpenDetailModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productID: string) => {
    console.log("Delete product", productID);
  };

  const inStockClass = "text-green-400 bg-green-400/10 flex-none rounded-full p-1";
  const outOfStockClass = "text-rose-400 bg-rose-400/10 flex-none rounded-full p-1";

  if (isLoading) {
    return <Spinder />;
  }

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
            <th className="py-2 pl-0 pr-8 font-semibold table-cell">Quantity</th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell">Stock Quantity</th>
            <th className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {products.map((item) => {
            const sizes = item.productSizes.map((size) => size.size).join(", ");
            const isInStock = item.productSizes.some((size) => size.quantity > 0);

            // Tính tổng realQuantity và stockQuantity
            const totalRealQuantity = item.productSizes.reduce((sum, size) => sum + size.realQuantity, 0);
            const totalStockQuantity = item.productSizes.reduce((sum, size) => sum + size.stockQuantity, 0);

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
                <td className="py-4 pl-0 table-cell pr-8">
                  <div className="flex gap-x-3">
                    <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                      {item.brand}
                    </div>
                  </div>
                </td>
                <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                  <div className="flex items-center gap-x-2 justify-start">
                    <div className={isInStock ? inStockClass : outOfStockClass}>
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <div className="dark:text-whiteSecondary text-blackPrimary block">
                      {sizes}
                    </div>
                  </div>
                </td>
                <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell">
                  {totalRealQuantity}
                </td>
                <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell">
                  {totalStockQuantity}
                </td>
                <td className="py-4 pl-0 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                  <div className="flex gap-x-1 justify-end">
                    <button
                      onClick={() => handleOpenDetailModal(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleOpenAddProductSizeModal(item.productID)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      <AiOutlinePlus />
                    </button>
                    <Link
                      to={`/products/edit/${item.productID}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      <HiOutlinePencil />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(item.productID)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ProductDetailModal
        isModalOpen={isDetailModalOpen}
        closeModal={handleCloseDetailModal}
        selectedProduct={selectedProduct}
      />

      <AddProductSize isModalOpen={isModalOpen} closeModal={handleCloseAddProductSizeModal} productID={selectedProductId} />
    </>
  );
};

export default ProductTable;