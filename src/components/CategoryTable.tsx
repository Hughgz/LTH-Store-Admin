import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import Spinder from "./Spinder";

interface Category {
  categoryId: string;
  name: string;
  productCount: number; // Số lượng sản phẩm trong danh mục
}

interface CategoryTableProps {
  categories: Category[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
          <col className="lg:w-2/12" />
        </colgroup>
        <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
          <tr>
            <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Category ID</th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell">Category Name</th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell">Products</th>
            <th className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {categories.map((category) => (
            <tr key={nanoid()}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                {category.categoryId}
              </td>
              <td className="py-4 pl-0 table-cell pr-8">
                <div className="flex gap-x-3">
                  <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                    {category.name}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 table-cell pr-8">
                <div className="flex gap-x-3">
                  <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                    {category.productCount}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <Link
                    to={`/categories/edit/${category.categoryId}`}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block justify-center items-center cursor-pointer hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </Link>
                  <button
                    aria-label="Delete Category"
                    onClick={() => console.log("Delete category", category.categoryId)}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block justify-center items-center cursor-pointer hover:border-gray-400"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CategoryTable;
