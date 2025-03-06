import { Sidebar } from "../components";
import { useState, useEffect } from "react";
import { HiOutlineCheck, HiOutlineClock } from "react-icons/hi";
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

  return (
    <div className="h-auto border-t border-blackSecondary flex dark:bg-blackPrimary bg-whiteSecondary relative">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full py-10 px-8">
        <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
          Confirm Stock Requests
        </h2>

        <div className="flex justify-between mb-4 mt-4">
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 text-gray-700 dark:text-gray-300">Show Confirmed</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={showAllRequests}
                onChange={() => setShowAllRequests(!showAllRequests)}
              />
              <div className="block w-10 h-6 bg-gray-300 rounded-full"></div>
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  showAllRequests ? "translate-x-4 bg-green-500" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading requests...</p>
        ) : (
          <>
            <table className="w-full border border-gray-700 rounded-md overflow-hidden">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="p-3 text-left">Datetime</th>
                  <th className="p-3 text-left">Total Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="border-t border-gray-600">
                    <td className="p-3">{request.datetime}</td>
                    <td className="p-3 font-bold">
                      {request.totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                    </td>
                    <td className="p-3">
                      {request.status === "Pending" ? (
                        <HiOutlineClock className="text-yellow-500" />
                      ) : (
                        <HiOutlineCheck className="text-green-500" />
                      )}
                      {request.status}
                    </td>
                    <td className="p-3">
                      {request.status === "Pending" && (
                        <button
                          onClick={() => handleApprove(request)}
                          className="bg-blackPrimary px-6 py-2 text-lg text-whiteSecondary hover:bg-blackSecondary duration-200"
                        >
                          <HiOutlineCheck className="text-xl" />
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-2 bg-gray-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-800">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-2 bg-gray-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
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
