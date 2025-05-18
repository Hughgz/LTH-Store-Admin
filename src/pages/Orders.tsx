import { OrderTable, Sidebar } from "../components";
import { HiOutlineChevronRight, HiOutlineSearch, HiOutlineFilter, HiOutlineDocumentDownload } from "react-icons/hi";
import { AiOutlineExport } from "react-icons/ai";
import { MdOutlineLocalShipping, MdPayment, MdOutlineShoppingCart } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { useEffect, useState } from "react";
import orderApi from "../utils/api/orderApi";
import userApi from "../utils/api/userApi";
import { formatPrice } from "../utils/formatters";

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
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 10;
  const visiblePageCount = 3;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders: Order[] = await orderApi.getOrders();
        const sortedOrders = [...fetchedOrders].sort(
          (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
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
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  // Filter orders by status and search query
  const filteredOrders = orders.filter((order) => {
    const user = users.find((u) => u.customerID === order.customerID);
    const fullName = user ? `${user.firstName} ${user.lastName}`.toLowerCase() : "";
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startPage = Math.max(
    Math.min(currentPage - 1, totalPages - visiblePageCount + 1),
    1
  );
  const endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

  // Order statistics for summary cards
  const pendingOrders = orders.filter(order => order.status === "Pending").length;
  const processingOrders = orders.filter(order => order.status === "Processing").length;
  const shippingOrders = orders.filter(order => order.status === "Shipping").length;
  const completedOrders = orders.filter(order => order.status === "Delivered").length;
  
  // Calculate total revenue from all orders
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="h-auto flex dark:bg-gray-900 bg-gray-50">
      <Sidebar />
      <div className="dark:bg-gray-900 bg-gray-50 w-full min-h-screen">
        {/* Header */}
        <div className="p-6 lg:px-8 border-b dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-800">
              Orders Management
            </h2>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <HiOutlineDocumentDownload className="mr-2 h-5 w-5" />
              Export Orders
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 lg:px-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                  <MdOutlineShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
                </div>
              </div>
            </div>
            
            {/* Orders in Process */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mr-4">
                  <FiPackage className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Processing</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{processingOrders}</p>
                </div>
              </div>
            </div>
            
            {/* Orders Shipping */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mr-4">
                  <MdOutlineLocalShipping className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{shippingOrders}</p>
                </div>
              </div>
            </div>
            
            {/* Total Revenue */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                  <MdPayment className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(totalRevenue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                <HiOutlineFilter className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Filter Orders
              </h3>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Search */}
                <div className="w-full sm:w-64">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to first page when search changes
                      }}
                    />
                  </div>
                </div>
                
                {/* Status filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order List</h3>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  <OrderTable orders={paginatedOrders} users={users} />
                  
                  {/* Pagination Controls */}
                  {filteredOrders.length > 0 && totalPages > 1 && (
                    <div className="flex justify-between items-center p-5 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center h-8 w-8 rounded-md ${
                          currentPage === 1 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <HiOutlineChevronRight className="h-5 w-5 rotate-180" />
                      </button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center h-8 w-8 rounded-md ${
                          currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <HiOutlineChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  {/* No data state */}
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-10">
                      <MdOutlineShoppingCart className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No orders found</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        No orders match the current filters.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
