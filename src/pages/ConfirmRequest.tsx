import { Sidebar } from "../components";
import { useState, useEffect } from "react";
import { HiOutlineCheck, HiOutlineClock, HiOutlineSearch } from "react-icons/hi";
import ApprovedRequestModal from "../components/ApprovedRequestModal";
import ConfirmPopup from "../components/ConfirmPopup";
import purchaseReceiptApi from "../utils/api/purchaseReceiptsApi";
import productSizeApi from "../utils/api/productSizeApi"; // Import API ProductSize
import productApi from "../utils/api/productApi"; // Import API ProductSize


interface ProductRequest {
  id: string;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  status: "Pending" | "Confirmed";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: string]: number }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await purchaseReceiptApi.getAll();
        console.log("Purchase Receipts Response:", response); // ✅ Kiểm tra dữ liệu đầu vào

        // 🔹 Lọc hóa đơn có status = 1 (Pending)
        const pendingReceipts = response.filter((receipt: any) => receipt.status === 1);

        // 🔹 Lấy danh sách `productSizeID` từ `purchaseReceipt.details`
        const productSizeIds = [...new Set(pendingReceipts.flatMap((receipt: any) =>
          receipt.details.map((detail: any) => detail.productSizeID)
        ))];

        console.log("ProductSize IDs to Fetch:", productSizeIds); // ✅ Kiểm tra danh sách ID cần lấy

        // 🔹 Gọi API lấy thông tin `productSize`
        const productSizeResponses = await Promise.all(
          productSizeIds.map(async (id) => {
            try {
              const productSize = await productSizeApi.getByIdProductSize(id);
              console.log(`✅ ProductSize for ID ${id}:`, productSize); // Debug
              return productSize;
            } catch (error) {
              console.error(`❌ Error fetching ProductSize for ID ${id}:`, error);
              return null;
            }
          })
        );

        const validProductSizes = productSizeResponses.filter(p => p !== null); // Bỏ lỗi

        // 🔹 Tạo `Map` để tra cứu nhanh `productSizeID` → `{ size, productID }`
        const productSizeMap = new Map(
          validProductSizes.map((p: any) => [p.productSizeID, { size: p.size, productID: p.productID }])
        );

        // 🔹 Lấy danh sách `productID` từ `productSize`
        const productIds = [...new Set(validProductSizes.map((p: any) => p.productID))];

        console.log("Product IDs to Fetch:", productIds); // ✅ Kiểm tra danh sách ID cần lấy productName

        // 🔹 Gọi API lấy `productName`
        const productResponses = await Promise.all(
          productIds.map(async (id) => {
            try {
              const product = await productApi.getProductById(id);
              console.log(`✅ Product Fetched for ID ${id}:`, product); // Debug
              return product;
            } catch (error) {
              console.error(`❌ Error fetching Product for ID ${id}:`, error);
              return null;
            }
          })
        );

        const validProducts = productResponses.filter(p => p !== null); // Bỏ lỗi

        // 🔹 Kiểm tra danh sách sản phẩm lấy được
        console.log("Valid Products:", validProducts);

        // 🔹 Tạo `Map` để tra cứu nhanh `productID` → `productName`
        const productMap = new Map(validProducts.map((p: any) => [p.productID, p.name]));

        // 🔹 Chuyển đổi dữ liệu từ API thành định dạng `Request[]`
        const formattedRequests: Request[] = pendingReceipts.map((receipt: any) => ({
          id: receipt.purchaseReceiptID,
          datetime: new Date(receipt.dateTime).toLocaleString(),
          totalAmount: receipt.totalPrice,
          status: "Pending",
          paymentType: receipt.paymentType,
          transactionID: receipt.transactionID,
          supplierId: receipt.supplierId,
          products: receipt.details.map((detail: any) => {
            const productSize = productSizeMap.get(detail.productSizeID);
            console.log(`🔍 Lookup for productSize ID ${detail.productSizeID}:`, productSize); // Debug

            // 🔹 Kiểm tra `productID` trước khi lấy `productName`
            const productID = productSize?.productID;
            const productName = productMap.get(productID) || `Unknown Product ${productID}`;

            // 🔹 Kiểm tra `size` trước khi hiển thị
            const productSizeValue = productSize?.size ? productSize.size.toString() : "Unknown Size";

            return {
              id: detail.productSizeID.toString(),
              productName, // ✅ Hiển thị đúng productName từ API
              size: productSizeValue, // ✅ Hiển thị đúng size từ API
              quantity: detail.quantity,
              unitPrice: detail.rawPrice,
              status: "Pending",
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

    fetchRequests();
  }, []);


  const handleApprove = (request: Request) => {
    setSelectedRequest(request);
    const initialQuantities: { [key: string]: number } = {};
    request.products.forEach((product) => {
      initialQuantities[product.id] = product.quantity;
    });
    setUpdatedQuantities(initialQuantities);
    setIsModalOpen(true);
  };

  // 🛠 Cập nhật số lượng sản phẩm khi người dùng thay đổi trong modal
  const handleUpdateQuantity = (productId: string, value: number) => {
    setUpdatedQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // 🛠 Mở popup xác nhận trước khi phê duyệt
  const handleOpenConfirmPopup = () => {
    setIsConfirmPopupOpen(true);
  };

  // 🛠 Xác nhận đơn hàng và cập nhật trạng thái
  const handleConfirmApproval = async () => {
    if (!selectedRequest) return;

    try {
      // ✅ Chuyển purchaseReceiptID thành chữ hoa để tránh lỗi phân biệt chữ hoa/thường
      const purchaseReceiptID = selectedRequest.id.toUpperCase();

      // ✅ In log kiểm tra URL API trước khi gửi
      console.log(`🔹 API URL: http://localhost:5049/api/PurchaseReceipts/confirm/${purchaseReceiptID}`);

      // ✅ Định dạng lại request body để đảm bảo dữ liệu đúng
      const requestBody = selectedRequest.products.map((product, index) => {
        return {
          purchaseReceiptDetailID: product.id, // ID chi tiết đơn hàng
          purchaseReceiptID: purchaseReceiptID, 
          productSizeID: product.id,
          realQuantity: updatedQuantities[product.id] ?? product.quantity, // Số lượng thực tế
        };
      });

      // ✅ Kiểm tra request body trước khi gửi
      console.log("🔹 Full API Request Body:", JSON.stringify(requestBody, null, 2));

      // ✅ Gửi yêu cầu API
      await purchaseReceiptApi.confirm(purchaseReceiptID, requestBody);
      console.log(`✅ Xác nhận thành công cho purchaseReceiptID: ${purchaseReceiptID}`);

      // ✅ Cập nhật giao diện sau khi xác nhận thành công
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === selectedRequest.id
            ? {
              ...req,
              status: "Confirmed",
              products: req.products.map((product) => ({
                ...product,
                quantity: updatedQuantities[product.id] ?? product.quantity,
                status: "Confirmed",
              })),
            }
            : req
        )
      );

      // Đóng modal và popup sau khi xác nhận
      setIsModalOpen(false);
      setSelectedRequest(null);
      setIsConfirmPopupOpen(false);
    } catch (error) {
      console.error("❌ Lỗi khi xác nhận đơn hàng:", error);
      alert("Xác nhận thất bại. Vui lòng thử lại.");
    }
  };
  return (
    <div className="h-auto border-t border-blackSecondary flex dark:bg-blackPrimary bg-whiteSecondary relative">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full py-10 px-8">
        <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
          Confirm Stock Requests
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading requests...</p>
        ) : (
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
              {requests.map((request) => (
                <tr key={request.id} className="border-t border-gray-600">
                  <td className="p-3">{request.datetime}</td>
                  <td className="p-3 font-bold">
                    {request.totalAmount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="p-3">
                    <HiOutlineClock className="text-yellow-500" /> {request.status}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleApprove(request)}
                      className="bg-blackPrimary px-6 py-2 text-lg text-whiteSecondary hover:bg-blackSecondary duration-200"
                    >
                      <HiOutlineCheck className="text-xl" />
                      Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ApprovedRequestModal */}
      <ApprovedRequestModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        selectedRequest={selectedRequest}
        updatedQuantities={updatedQuantities}
        handleUpdateQuantity={handleUpdateQuantity}
        handleConfirmApproval={handleOpenConfirmPopup}
        totalAmountFinal={
          selectedRequest
            ? selectedRequest.products.reduce(
              (sum, product) => sum + (updatedQuantities[product.id] ?? product.quantity) * product.unitPrice,
              0
            )
            : 0
        }
      />
      <ConfirmPopup
        isOpen={isConfirmPopupOpen}
        onClose={() => setIsConfirmPopupOpen(false)}
        onConfirm={handleConfirmApproval}
      />
    </div>
  );
};

export default ConfirmRequest;
