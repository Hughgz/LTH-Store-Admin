import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { HiOutlinePencil, HiOutlineEye } from "react-icons/hi";
import UpdateOrderModal from "./UpdateOrderModal";
import OrderDetailModal from "./OrderDetailModal";
import axios from "axios";
import Spinder from "./Spinder"; // Import Spinder component

interface User {
  customerID: string;
  firstName: string;
  lastName: string;
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

interface Order {
  orderID: string;
  customerID: string;
  dateTime: string;
  totalPrice: number;
  paymentType: string;
  status: string;
  orderItems?: OrderItem[];
}

interface OrderTableProps {
  orders: Order[];
  users: User[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, users }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true); // State for loading
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Simulate loading effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, []);

  const handleOpenUpdateModal = (orderId: string, status: string) => {
    setSelectedOrderId(orderId);
    setSelectedOrderStatus(status);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleOpenDetailModal = async (order: Order) => {
    try {
      const response = await axios.get(
        `https://lthshop.azurewebsites.net/api/OrderItems/${order.orderID}`
      );
      const orderWithItems: Order = {
        ...order,
        orderItems: response.data,
      };
      setSelectedOrder(orderWithItems);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const getCustomerName = (customerID: string): string => {
    const user = users.find((user) => user.customerID === customerID);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown Customer";
  };

  // Render loading spinner if data is loading
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
            <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
              Customer Name
            </th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell">Date/Time</th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell">Price</th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell">
              Payment Type
            </th>
            <th className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20">
              Status
            </th>
            <th className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {orders.map((order) => (
            <tr key={nanoid()}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {getCustomerName(order.customerID)}
                </div>
              </td>
              <td className="py-4 pl-0 table-cell pr-8">
                <div className="text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {new Date(order.dateTime).toLocaleString()}
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 table-cell pr-8">
                <div className="text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                  {order.totalPrice.toLocaleString() + " VNĐ"}
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                <div className="dark:text-whiteSecondary text-blackPrimary">
                  {order.paymentType || "N/A"}
                </div>
              </td>
              <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell lg:pr-20">
                <div
                  className={`text-sm leading-6 py-1 px-2 rounded-full font-semibold ${order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Shipping"
                          ? "bg-orange-100 text-orange-800"
                          : order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {order.status}
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <button
                    onClick={() =>
                      handleOpenUpdateModal(order.orderID, order.status)
                    }
                    className="bg-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-400"
                    aria-label="Edit Order"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </button>

                  <button
                    onClick={() => handleOpenDetailModal(order)}
                    className="bg-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-400"
                    aria-label="View Order Details"
                  >
                    <HiOutlineEye className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateOrderModal
        isModalOpen={isUpdateModalOpen}
        closeModal={handleCloseUpdateModal}
        orderId={selectedOrderId}
        currentStatus={selectedOrderStatus}
      />
      {selectedOrder && (
        <OrderDetailModal
          isModalOpen={isDetailModalOpen}
          closeModal={handleCloseDetailModal}
          selectedOrder={selectedOrder}
        />
      )}
    </>
  );
};

export default OrderTable;
