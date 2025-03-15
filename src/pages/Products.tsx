import { Sidebar, WhiteButton } from "../components";
import { HiOutlinePlus, HiOutlineChevronRight, HiOutlineSearch } from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { useEffect, useState } from "react";
import productApi from "../utils/api/productApi";
import ProductTable from "../components/ProductTable";

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

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Danh sách sản phẩm
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái tải
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const [searchTerm, setSearchTerm] = useState<string>(""); // Từ khóa tìm kiếm
  const rowsPerPage = 10; // Số sản phẩm mỗi trang

  // Tính toán tổng số trang
  const totalPages = Math.ceil(products.length / rowsPerPage);

  // Lọc sản phẩm theo từ khóa tìm kiếm và phân trang
  const paginatedProducts = products
    .filter((product) =>
      `${product.name}`.toLowerCase().includes(searchTerm.toLowerCase()) // Lọc sản phẩm dựa trên từ khóa tìm kiếm
    )
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProducts();
        setProducts(data);
        setError(null);
        console.log("Data Product: ", data);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                All products
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>All products</span>
              </p>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg hover:border-gray-500 duration-200 flex items-center justify-center gap-x-2">
                <AiOutlineExport className="dark:text-whiteSecondary text-blackPrimary text-base" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Export
                </span>
              </button>
              <WhiteButton
                link="/products/create-product"
                text="Add a product"
                textSize="lg"
                py="2"
                width="48"
              >
                <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
              </WhiteButton>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
                placeholder="Search products..."
                value={searchTerm} // Bind input to searchTerm state
                onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
              />
            </div>
          </div>
          {/* Hiển thị danh sách sản phẩm */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ProductTable products={paginatedProducts} />
          )}
          {/* Phân trang */}
          <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`border border-gray-600 py-1 px-3 ${
                    currentPage === page
                      ? "dark:bg-whiteSecondary bg-blackPrimary dark:text-blackPrimary text-whiteSecondary"
                      : "dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary"
                  } hover:border-gray-500`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;