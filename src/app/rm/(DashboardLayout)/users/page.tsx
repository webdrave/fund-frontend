"use client";
import { useState } from "react";
import { Pencil, Bell, X, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCreateNotificationMutation } from "@/redux/services/notificationApi";
import { useGetDsasByRmIdQuery } from "@/redux/services/superadminApi";

interface DSA {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  planName: string;
  createdAt: string;
  rmId: string;
  isDeleted?: boolean;
}

export default function ManageDSAs() {
  const { data: session } = useSession();
  const rmId = session?.user?.id; // Get the current RM's ID
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Notification overlay states
  const [showNotifyOverlay, setShowNotifyOverlay] = useState(false);
  const [currentDsaId, setCurrentDsaId] = useState("");
  const [currentDsaName, setCurrentDsaName] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationStatus, setNotificationStatus] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const {
    data: dsaUsers = [],
    isLoading,
    isError,
    refetch,
  } = useGetDsasByRmIdQuery(rmId || "", { skip: !rmId });

  const [createNotification, { isLoading: isSendingNotification }] =
    useCreateNotificationMutation();

  const handleViewDetails = (id: string) => {
    router.push(`/rm/users/${id}`);
  };

  const handleNotify = (id: string, name: string) => {
    setCurrentDsaId(id);
    setCurrentDsaName(name);
    setNotificationTitle("");
    setNotificationMessage("");
    setShowNotifyOverlay(true);
  };

  const sendNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      setNotificationStatus({
        show: true,
        message: "Please fill in both title and message fields",
        type: "error",
      });
      return;
    }

    try {
      await createNotification({
        userId: currentDsaId,
        title: notificationTitle.trim(),
        message: notificationMessage.trim(),
      }).unwrap();

      setNotificationStatus({
        show: true,
        message: "Notification sent successfully!",
        type: "success",
      });

      // Hide notification form after 2 seconds on success
      setTimeout(() => {
        setShowNotifyOverlay(false);
        setNotificationStatus({
          show: false,
          message: "",
          type: "success",
        });
      }, 2000);
    } catch (error: any) {
      setNotificationStatus({
        show: true,
        message: error?.data?.error?.message || "Failed to send notification",
        type: "error",
      });
    }
  };

  const filteredDsas = dsaUsers.filter((dsa: DSA) => {
    const matchesSearch =
      dsa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dsa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dsa.planName &&
        dsa.planName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? !dsa.isDeleted
        : dsa.isDeleted;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Manage <span className="text-[#FFD439]">DSA Users</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View, filter, and manage all DSA users assigned to you.
          </p>
        </div>

        {/* Notification Overlay */}
        {showNotifyOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white border-2 border-black shadow-[6px_6px_0_0_#000] rounded-xl p-6 max-w-md w-full m-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">
                  Notify
                  <span className="text-[#FFD439] pl-3">{currentDsaName}</span>
                </h2>
                <button
                  onClick={() => setShowNotifyOverlay(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={20} />
                </button>
              </div>

              {notificationStatus.show && (
                <div
                  className={`mb-4 p-3 rounded-lg text-white ${
                    notificationStatus.type === "success"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {notificationStatus.message}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    className="w-full border-2 border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter notification title"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    rows={4}
                    className="w-full border-2 border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter notification message"
                  ></textarea>
                </div>

                <button
                  onClick={sendNotification}
                  disabled={isSendingNotification}
                  className={`px-6 py-2 w-full rounded-xl font-semibold border-2 border-black transition-all duration-300 ${
                    isSendingNotification
                      ? "bg-gray-300 cursor-not-allowed text-black"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isSendingNotification ? "Sending..." : "Send Notification"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and filters */}
        <div className="bg-white shadow-[6px_6px_0_0_#000] border-2 border-black rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search DSA users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-black rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border-2 border-black rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-black">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                      </div>
                      <div className="mt-2">Loading DSA users...</div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-red-500"
                    >
                      Error loading DSA users. Please try again.
                    </td>
                  </tr>
                ) : filteredDsas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No DSA users found under your management
                    </td>
                  </tr>
                ) : (
                  filteredDsas.map((dsa: DSA) => (
                    <tr
                      key={dsa._id}
                      className={`hover:bg-gray-50 ${
                        dsa.isDeleted ? "bg-gray-100" : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {dsa.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {dsa.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {dsa.planName || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            !dsa.isDeleted
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {!dsa.isDeleted ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => handleNotify(dsa._id, dsa.name)}
                          className="text-gray-600 hover:text-yellow-600"
                          title="Send Notification"
                        >
                          <Bell size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}