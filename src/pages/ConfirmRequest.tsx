import { Sidebar } from "../components";
import { useState, useEffect } from "react";
import { HiOutlineCheck, HiOutlineClock, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineFilter } from "react-icons/hi";
import { MdPayment } from "react-icons/md";
import ApprovedRequestModal from "../components/ApprovedRequestModal";
import purchaseReceiptApi from "../utils/api/purchaseReceiptsApi";
import productSizeApi from "../utils/api/productSizeApi";
import productApi from "../utils/api/productApi";

interface ProductRequest {
  id: string;
  productName: string;
  size: string;
  quantity: number;
  stockQuantity: number;
  unitPrice: number;
  productSizeID: number;
}

interface Request {
  id: string;
  products: ProductRequest[];
  totalAmount: number;
  status: "Pending" | "Confirmed";
  datetime: string;
  paymentType: string;
  transactionID: string;
  supplierId: number;
}

const ConfirmRequest: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: string]: number }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showAllRequests, setShowAllRequests] = useState<boolean>(false);

  // 🔹 Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const requestsPerPage = 5;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await purchaseReceiptApi.getAll();

      const productSizeIds = [...new Set(response.flatMap((receipt: any) =>
        receipt.details.map((detail: any) => detail.productSizeID)
      ))];

      const productSizeResponses = await Promise.all(
        productSizeIds.map(async (id) => {
          try {
            return await productSizeApi.getByIdProductSize(id);
          } catch {
            return null;
          }
        })
      );

      const validProductSizes = productSizeResponses.filter(p => p !== null);
      const productSizeMap = new Map(validProductSizes.map((p: any) => [p.productSizeID, { size: p.size, productID: p.productID }]));
      const productIds = [...new Set(validProductSizes.map((p: any) => p.productID))];

      const productResponses = await Promise.all(
        productIds.map(async (id) => {
          try {
            return await productApi.getProductById(id);
          } catch {
            return null;
          }
        })
      );

      const validProducts = productResponses.filter(p => p !== null);
      const productMap = new Map(validProducts.map((p: any) => [p.productID, p.name]));

      const formattedRequests: Request[] = response.map((receipt: any) => ({
        id: receipt.purchaseReceiptID,
        datetime: new Date(receipt.dateTime).toLocaleString(),
        totalAmount: receipt.totalPrice,
        status: receipt.status === 1 ? "Pending" : "Confirmed",
        paymentType: receipt.paymentType,
        transactionID: receipt.transactionID,
        supplierId: receipt.supplierId,
        products: receipt.details.map((detail: any) => {
          const productSize = productSizeMap.get(detail.productSizeID);
          const productID = productSize?.productID;
          const productName = productMap.get(productID) || `Unknown Product ${productID}`;

          return {
            id: detail.purchaseReceiptDetailID,
            productName,
            productSizeID: detail.productSizeID,
            size: productSize?.size ? productSize.size.toString() : "Unknown Size",
            quantity: detail.quantity,
            stockQuantity: detail.quantity,
            unitPrice: detail.rawPrice,
          };
        }),
      }));

      setRequests(formattedRequests);
    } catch (error) {
      console.error("❌ Failed to fetch purchase receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (request: Request) => {
    setSelectedRequest(request);
    setUpdatedQuantities(Object.fromEntries(request.products.map(product => [product.id, product.quantity])));
    setIsModalOpen(true);
  };

  const filteredRequests = showAllRequests
    ? requests
    : requests.filter((request) => request.status === "Pending");

  // 🔹 Pagination Logic
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );

  // Count pending and confirmed requests
  const pendingCount = requests.filter(req => req.status === "Pending").length;
  const confirmedCount = requests.filter(req => req.status === "Confirmed").length;

  return (
    <div className="h-auto flex dark:bg-gray-900 bg-gray-50">
      <Sidebar />
      <div className="dark:bg-gray-900 bg-gray-50 w-full min-h-screen">
        {/* Header */}
        <div className="p-6 lg:px-8 border-b dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-800">
              Confirm Stock Requests
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 lg:px-8 space-y-6">
          {/* Status Card Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* All Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                  <HiOutlineFilter className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">All Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{requests.length}</p>
                </div>
              </div>
            </div>
            
            {/* Pending Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mr-4">
                  <HiOutlineClock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
                </div>
              </div>
            </div>
            
            {/* Confirmed Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-5 flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
                  <HiOutlineCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{confirmedCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">Show Confirmed Requests</span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      value="" 
                      className="sr-only peer"
                      checked={showAllRequests}
                      onChange={() => setShowAllRequests(!showAllRequests)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </div>
                </label>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {showAllRequests ? "all" : "pending"} requests ({filteredRequests.length})
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stock Requests</h3>
            </div>
            
            <div className="p-5">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {filteredRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Datetime</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {paginatedRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                #{request.id}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {request.datetime}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex items-center">
                                  <MdPayment className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                                  <span className="capitalize">{request.paymentType}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {request.totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {request.status === "Pending" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                    <HiOutlineClock className="mr-1 h-3 w-3" />
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    <HiOutlineCheck className="mr-1 h-3 w-3" />
                                    Confirmed
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {request.status === "Pending" && (
                                  <button
                                    onClick={() => handleApprove(request)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    <HiOutlineCheck className="mr-1.5 h-4 w-4" />
                                    Confirm
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="text-gray-500 dark:text-gray-400">
                        <p className="mb-1">No {showAllRequests ? "" : "pending"} requests found</p>
                        <p className="text-sm">{showAllRequests ? "There are no requests in the system" : "All requests have been confirmed"}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Pagination Controls */}
                  {filteredRequests.length > requestsPerPage && (
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center h-8 w-8 rounded-md ${
                          currentPage === 1 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <HiOutlineChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ApprovedRequestModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        selectedRequest={selectedRequest}
        updatedQuantities={updatedQuantities}
        setUpdatedQuantities={setUpdatedQuantities}
      />
    </div>
  );
};

export default ConfirmRequest;
