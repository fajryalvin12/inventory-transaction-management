import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import TransactionFormModal from "../components/TransactionFormModal";
import { getTransactionsList, getTransactionDetails } from "../services/transactionServices";

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [detailModal, setDetailModal] = useState({ open: false, data: null, loading: false });
  const [createModal, setCreateModal] = useState(false);
  const limit = 10;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const result = await getTransactionsList({ page, limit });
      setTransactions(result.data);
      setMeta(result.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, [page]);

  const handleOpenDetail = async (id) => {
    setDetailModal({ open: true, data: null, loading: true });
    try {
      const data = await getTransactionDetails(id);
      setDetailModal({ open: true, data, loading: false });
    } catch (err) {
      console.error(err);
      setDetailModal({ open: false, data: null, loading: false });
    }
  };

  const handleCreateSuccess = () => {
    setCreateModal(false);
    setPage(1);
    fetchTransactions();
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Transactions</h2>
          <p className="text-xs text-gray-400 mt-0.5">History and new orders</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <span className="text-base leading-none">＋</span>
          New Transaction
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-sm text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <span className="text-3xl">🧾</span>
                    <p className="text-sm">No transactions yet</p>
                    <button
                      onClick={() => setCreateModal(true)}
                      className="mt-2 text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      Create your first transaction →
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm text-gray-500 font-mono">
                    #{String(trx.id).padStart(4, "0")}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {trx.user.username[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700">{trx.user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-800">
                    Rp {trx.total_price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(trx.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                    <span className="ml-1.5 text-xs text-gray-400">
                      {new Date(trx.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleOpenDetail(trx.id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {meta && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Page {meta.page} · {limit} per page
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={transactions.length < limit}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, data: null, loading: false })}
        title={`Transaction #${String(detailModal.data?.id || 0).padStart(4, "0")}`}
      >
        {detailModal.loading ? (
          <div className="flex justify-center py-8 text-gray-400 text-sm">Loading...</div>
        ) : detailModal.data ? (
          <div className="flex flex-col gap-3">
            {/* Meta info */}
            <div className="flex flex-col gap-2 bg-gray-50 rounded-lg px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Cashier ID</span>
                <span className="font-medium text-gray-800">{detailModal.data.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">
                  {new Date(detailModal.data.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit", month: "long", year: "numeric",
                  })}{" "}
                  <span className="text-gray-400 text-xs">
                    {new Date(detailModal.data.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</p>
              {detailModal.data.items?.map((item, i) => (
                <div key={i} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.product?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center bg-indigo-50 rounded-lg px-4 py-3 mt-1">
              <span className="text-sm font-semibold text-indigo-700">Total</span>
              <span className="text-base font-bold text-indigo-700">
                Rp {detailModal.data.total_price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Create Transaction Modal */}
      <TransactionFormModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}

export default TransactionPage;
