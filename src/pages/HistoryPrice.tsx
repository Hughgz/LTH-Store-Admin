import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { HiOutlineChevronRight } from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";

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
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof item.size === 'string' && item.size.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    : [];  // Nếu searchTerm trống, không hiển thị

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                History of Price Changes
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>Price History</span>
              </p>
            </div>
            <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
              <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                <AiOutlineExport className="dark:text-whiteSecondary text-blackPrimary text-base" />
                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                  Export
                </span>
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 mt-5">
            {/* Input để tìm kiếm sản phẩm và size */}
            <input
              type="text"
              className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
              placeholder="Search Product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={fetchPrices}
              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Filter
            </button>
          </div>

          {/* Hiển thị kết quả tìm kiếm dưới dạng dropdown */}
          {searchTerm && filteredProductsAndSizes.length > 0 && (
            <div className="mt-0 ml-8 absolute bg-white border border-gray-600 w-60 max-h-40 overflow-y-auto z-10">
              <ul>
                {filteredProductsAndSizes.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setSearchTerm(`${item.name} - ${item.size}`);
                      setProductSizeId(item.id.toString());
                    }}
                    className="cursor-pointer hover:bg-gray-200 px-4 py-2"
                  >
                    {item.name} - {item.size}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <table className="min-w-full table-auto border-collapse mt-5">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b dark:text-whiteSecondary text-blackPrimary">Created At</th>
                <th className="px-4 py-2 border-b dark:text-whiteSecondary text-blackPrimary">Start Date</th>
                <th className="px-4 py-2 border-b dark:text-whiteSecondary text-blackPrimary">End Date</th>
                <th className="px-4 py-2 border-b dark:text-whiteSecondary text-blackPrimary">Product Name</th>
                <th className="px-4 py-2 border-b dark:text-whiteSecondary text-blackPrimary">Size</th>
                <th className="px-4 py-2 border-b dark:text-whiteSecondary text-blackPrimary">Selling Price</th>
                <th className="px-4 py-2 border-b dark:text-whiteSecondary text-blackPrimary">Status</th>
                <th className="px-4 py-2 border-b dark:text-whiteSecondary text-blackPrimary">Description</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-gray-1500">
                    No stock history available for the selected period.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((HistoryPrice) => (
                  <tr key={HistoryPrice.id}>
                    <td className="px-4 py-5 border-b text-center">{HistoryPrice.createdAt}</td>
                    <td className="px-4 py-6 border-b text-center">{HistoryPrice.startDate}</td>
                    <td className="px-4 py-6 border-b text-center">{HistoryPrice.endDate}</td>
                    <td className="px-4 py-6 border-b text-center">{HistoryPrice.productName}</td>
                    <td className="px-4 py-6 border-b text-center">{HistoryPrice.size}</td>
                    <td className="px-4 py-6 border-b text-center">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(HistoryPrice.sellingPrice)}
                    </td>
                    <td className="px-4 py-6 border-b text-center">
                      {HistoryPrice.productPriceStatus == "0" ? (
                        <span className="text-green-600">Active</span>
                      ) : HistoryPrice.productPriceStatus == "1" ? (
                        <span className="text-gray-600">Inactive</span>
                      ) : HistoryPrice.productPriceStatus == "2" ? (
                        <span className="text-yellow-600">Pending</span>
                      ) : (
                        <span className="text-red-600">Reject</span>
                      )}
                    </td>
                    <td className="px-4 py-6 border-b text-left">{HistoryPrice.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
              >
                Prev
              </button>
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`border border-gray-600 py-1 px-3 ${currentPage === page
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

export default HistoryPrice;