import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import ProductFormModal from "../components/ProductFormModal";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/productServices";

const STATUS_COLORS = {
  Available: "bg-green-50 text-green-700",
  SoldOut: "bg-red-50 text-red-600",
};

function ProductList() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formModal, setFormModal] = useState({ open: false, product: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const limit = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await getProducts({ page, limit, name: search, status: statusFilter });
      setProducts(result.data);
      setMeta(result.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleFormSubmit = async (data) => {
    if (formModal.product) {
      await updateProduct(formModal.product.id, data);
    } else {
      await createProduct(data);
    }
    fetchProducts();
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteModal.product.id);
      setDeleteModal({ open: false, product: null });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Products</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, product: null })}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <span className="text-base leading-none">＋</span>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Search product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Search
          </button>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="SoldOut">Sold Out</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 text-left font-medium">#</th>
              <th className="px-6 py-3 text-left font-medium">Product Name</th>
              <th className="px-6 py-3 text-left font-medium">Price</th>
              <th className="px-6 py-3 text-left font-medium">Stock</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-sm text-gray-400">Loading...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <span className="text-3xl">📦</span>
                    <p className="text-sm">No products found</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-xs text-gray-400 font-mono">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-800">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-sm font-medium ${product.quantity <= 10 ? "text-amber-600" : "text-gray-700"}`}>
                      {product.quantity}
                      {product.quantity <= 10 && <span className="ml-1 text-xs">⚠️</span>}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[product.status] || "bg-gray-100 text-gray-500"}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFormModal({ open: true, product })}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, product })}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Page {meta.page} of {meta.totalPages} · {meta.total} products
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
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, product: null })}
        onSubmit={handleFormSubmit}
        product={formModal.product}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Delete Product"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800">{deleteModal.product?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setDeleteModal({ open: false, product: null })}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg cursor-pointer transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductList;
