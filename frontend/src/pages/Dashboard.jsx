import Card from "../components/Card";
import Modal from "../components/Modal";
import { getDashboardSummary } from "../services/dashboardServices";
import {
  getTransactionsList,
  getTransactionDetails,
} from "../services/transactionServices";
import { useEffect, useState } from "react";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [trxDetails, setTrxDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log("transactions : ", transactions);
  console.log("trxDetails : ", trxDetails);

  useEffect(() => {
    async function fetchData() {
      try {
        const [data, dataTrx] = await Promise.all([
          getDashboardSummary(),
          getTransactionsList(),
        ]);
        setSummary(data);
        setTransactions(dataTrx);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const overview = [
    {
      icon: "📦",
      count: summary?.totalProducts || 0,
      status: "Total Products",
      trend: 5,
    },
    {
      icon: "🛒",
      count: summary?.totalTransactions || 0,
      status: "Total Orders",
      trend: 12,
    },
    {
      icon: "💰",
      count: summary?.totalRevenue || 0,
      status: "Revenue",
      trend: 8,
    },
    {
      icon: "⚠️",
      count: summary?.lowStockProducts || 0,
      status: "Low Stock",
      trend: -3,
    },
  ];

  const handleDetailTrx = async (id) => {
    try {
      const details = await getTransactionDetails(id);
      setTrxDetails(details);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      {/* Summary Cards */}
      <div className="flex gap-4">
        {overview.map((item, index) => (
          <Card
            key={index}
            icon={item.icon}
            count={item.count}
            status={item.status}
            trend={item.trend}
          />
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm">
            Recent Transactions
          </h2>
          <span className="text-xs text-gray-400">
            {transactions.length} entries
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16 text-gray-400 text-sm">
            Loading...
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-3xl mb-2">🧾</span>
            <p className="text-sm">No transactions yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-medium">#ID</th>
                <th className="px-6 py-3 text-left font-medium">Cashier</th>
                <th className="px-6 py-3 text-left font-medium">Total</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.data.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-500 font-mono">
                    #{String(trx.id).padStart(4, "0")}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                        {trx.user.username[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700">
                        {trx.user.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-800">
                    Rp {trx.total_price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(trx.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleDetailTrx(trx.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTrxDetails(null);
        }}
        title={`Transaction #${String(trxDetails?.id || 0).padStart(4, "0")}`}
      >
        {trxDetails ? (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Cashier</span>
              <span className="font-medium text-gray-800">
                {trxDetails.user_id}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Date</span>
              <span className="font-medium text-gray-800">
                {new Date(trxDetails.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <hr className="border-gray-100 my-1" />
            <div className="flex flex-col gap-2">
              {trxDetails.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      x{item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-700">
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
            <hr className="border-gray-100 my-1" />
            <div className="flex justify-between text-sm font-bold text-gray-800">
              <span>Total</span>
              <span>Rp {trxDetails.total_price.toLocaleString("id-ID")}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
        )}
      </Modal>
    </div>
  );
}

export default Dashboard;
