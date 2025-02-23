import { Sidebar } from "../components";
import { useState, useEffect } from "react";
import { HiOutlineCheck, HiOutlineClock, HiOutlineSearch } from "react-icons/hi";

interface Request {
  id: string;
  productName: string;
  size: string;
  quantity: number;
  status: "Pending" | "Approved";
}

const ConfirmRequest: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    // Simulated API fetch
    setTimeout(() => {
      setRequests([
        {
          id: "1",
          productName: "Nike Air Max 270",
          size: "US 8",
          quantity: 10,
          status: "Pending",
        },
        {
          id: "2",
          productName: "Adidas Ultraboost 22",
          size: "US 9",
          quantity: 5,
          status: "Approved",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (id: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id ? { ...request, status: "Approved" } : request
      )
    );
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.status === "Pending" &&
      request.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-auto border-t border-blackSecondary flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full py-10 px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
            Confirm Requests
          </h2>
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search request..."
              className="pl-10 pr-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:text-whiteSecondary border-gray-600 focus:outline-none focus:border-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <p className="text-lg text-gray-500">Loading requests...</p>
        ) : (
          <table className="w-full border border-gray-700 rounded-md overflow-hidden">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-t border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="p-3">{request.productName}</td>
                  <td className="p-3">{request.size}</td>
                  <td className="p-3">{request.quantity}</td>
                  <td className="p-3 flex items-center gap-2">
                    <HiOutlineClock className="text-yellow-500" />
                    {request.status}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ConfirmRequest;
