import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { HiOutlinePencil, HiOutlineEye } from "react-icons/hi";
import UpdateOrderModal from "./UpdateOrderModal";
import OrderDetailModal from "./OrderDetailModal";
import axios from "axios";
import Spinder from "./Spinder"; // Import Spinder component
import { formatPrice } from "../utils/formatters";

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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        `http://localhost:5049/api/OrderItems/${order.orderID}`
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Pending
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Processing
          </span>
        );
      case "Shipping":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            Shipping
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Delivered
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orders || orders.length === 0) {
    return null;
  }

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date/Time
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Payment
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {orders.map((order) => (
            <tr key={nanoid()} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {getCustomerName(order.customerID)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {String(order.orderID).substring(0, 8)}...
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(order.dateTime)}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatPrice(order.totalPrice)}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {order.paymentType || "N/A"}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {getStatusBadge(order.status)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right">
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => handleOpenUpdateModal(order.orderID, order.status)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Edit Order"
                  >
                    <HiOutlinePencil className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleOpenDetailModal(order)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="View Order Details"
                  >
                    <HiOutlineEye className="h-5 w-5" />
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
