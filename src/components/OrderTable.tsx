import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import UpdateOrderModal from "./UpdateOrderModal";
import OrderDetailModal from "./OrderDetailModal";
import axios from "axios";

const OrderTable = ({ orders, users }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenUpdateModal = (orderId, status) => {
    setSelectedOrderId(orderId);
    setSelectedOrderStatus(status);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleOpenDetailModal = async (order) => {
    try {
      const response = await axios.get(
        `https://lthshop.azurewebsites.net/api/OrderItems/${order.orderID}`
      );
      const orderWithItems = {
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

  const getCustomerName = (customerID) => {
    const user = users.find((user) => user.customerID === customerID);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown Customer";
  };

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
            <th
              scope="col"
              className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              Customer Name
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
              Date/Time
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
              Price
            </th>
            <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
              Payment Type
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20"
            >
              Status
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8"
            >
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
              <td className="py-4 pl-0 pr-4 table-cell pr-8">
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
                    onClick={() => handleOpenUpdateModal(order.orderID, order.status)}
                    className="bg-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-400"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleOpenDetailModal(order)}
                    className="bg-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 flex justify-center items-center hover:border-gray-400"
                  >
                    <HiOutlineEye className="text-lg" />
                  </button>
                  {/* <button
                    onClick={() => console.log("Delete order", order.orderID)}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button> */}
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
