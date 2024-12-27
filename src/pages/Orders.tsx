import { OrderTable, Sidebar } from "../components";
import { HiOutlineChevronRight, HiOutlineSearch } from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { useEffect, useState } from "react";
import orderApi from "../utils/api/orderApi";
import userApi from "../utils/api/userApi";

// Định nghĩa kiểu dữ liệu cho Order và User
interface Order {
  orderID: string;
  customerID: string;
  dateTime: string;
  totalPrice: number;
  paymentType: string;
  status: string;
  orderItems?: OrderItem[];
}

interface OrderItem {
  product: {
    imageURL: string;
    name: string;
  };
  productSize: {
    size: string;
    price: number;
  };
  quantity: number;
}

interface User {
  customerID: string;
  firstName: string;
  lastName: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;
  const visiblePageCount = 3;

  const totalPages = Math.ceil(orders.length / rowsPerPage);

  const startPage = Math.max(
    Math.min(currentPage - 1, totalPages - visiblePageCount + 1),
    1
  );
  const endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders: Order[] = await orderApi.getOrders();
        const sortedOrders = [...fetchedOrders].sort(
          (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } 
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data: User[] = await userApi.getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchUsers();
  }, []);

  // Tìm kiếm Orders theo tên khách hàng
  const filteredOrders = orders.filter((order) => {
    const user = users.find((u) => u.customerID === order.customerID);
    const fullName = user ? `${user.firstName} ${user.lastName}`.toLowerCase() : "";
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Lấy dữ liệu phân trang
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                All orders
              </h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base font-normal flex items-center">
                <span>Dashboard</span>{" "}
                <HiOutlineChevronRight className="text-lg" />{" "}
                <span>All orders</span>
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
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 dark:focus:border-gray-500 focus:border-gray-400"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <OrderTable orders={paginatedOrders} users={users} />
          <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary py-1 px-3 hover:border-gray-500"
              >
                Prev
              </button>
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((page) => (
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

export default Orders;
