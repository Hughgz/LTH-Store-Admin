import { Sidebar, WhiteButton } from "../components";
import { HiOutlinePlus, HiOutlineChevronRight, HiOutlineSearch } from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { useState } from "react";
import CategoryTable from "../components/CategoryTable";
import categoriesData from "../data/data.json"; // Import dữ liệu mẫu

// Định nghĩa interface có productCount
interface Category {
  categoryId: string;
  name: string;
  productCount: number; // Số sản phẩm trong danh mục
}

const Categories: React.FC = () => {
  // Thêm giá trị mặc định cho productCount
  const [categories, setCategories] = useState<Category[]>(
    categoriesData.map((category) => ({
      ...category,
      productCount: Math.floor(Math.random() * 100), // Tạo số lượng sản phẩm ngẫu nhiên
    }))
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const rowsPerPage = 5; // Số danh mục hiển thị mỗi trang
  const totalPages = Math.ceil(categories.length / rowsPerPage);

  // Lọc và phân trang danh mục
  const paginatedCategories = categories
    .filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Fashion Categories</h2>
            <p className="text-gray-500 flex items-center">
              Dashboard <HiOutlineChevronRight className="mx-2" /> Categories
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <AiOutlineExport className="text-lg mr-2" /> Export
            </button>
            <WhiteButton
                link="/categories/create"
                text="Add a category"
                textSize="lg"
                py="2"
                width="48"
              >
                <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
              </WhiteButton>
          </div>
        </div>

        <div className="relative w-80 mb-4">
          <HiOutlineSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:text-white"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CategoryTable categories={paginatedCategories} />

        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 mx-1 border rounded-lg transition-all ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
