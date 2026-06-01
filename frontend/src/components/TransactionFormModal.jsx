import { useState, useEffect } from "react";
import Modal from "./Modal";
import { getProducts } from "../services/productServices";
import { createTransaction } from "../services/transactionServices";

function TransactionFormModal({ isOpen, onClose, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [cart, setCart] = useState([]); // [{ product, quantity }]
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch available products when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setCart([]);
    setSearch("");
    setError("");
    fetchProducts();
  }, [isOpen]);

  const fetchProducts = async (name = "") => {
    setLoadingProducts(true);
    try {
      const result = await getProducts({ limit: 50, status: "Available", name });
      setProducts(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    fetchProducts(val);
  };

  // Add product to cart or increment qty
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) return prev; // max stock
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId, val) => {
    const num = parseInt(val);
    if (isNaN(num) || num < 1) return;
    const product = products.find((p) => p.id === productId);
    if (product && num > product.quantity) return;
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: num } : i))
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) { setError("Add at least one product."); return; }
    setError("");
    setSubmitting(true);
    try {
      const items = cart.map((i) => ({ product_id: i.product.id, quantity: i.quantity }));
      await createTransaction(items);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Transaction">
      <div className="flex flex-col gap-4">

        {/* Product search */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Add Products
          </label>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search available products..."
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          {/* Product list */}
          <div className="border border-gray-100 rounded-lg overflow-hidden max-h-44 overflow-y-auto">
            {loadingProducts ? (
              <p className="text-xs text-gray-400 text-center py-4">Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No products found</p>
            ) : (
              products.map((product) => {
                const inCart = cart.find((i) => i.product.id === product.id);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">
                        Rp {product.price.toLocaleString("id-ID")} · stok {product.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={inCart?.quantity >= product.quantity}
                      className={`ml-3 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                        inCart
                          ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {inCart ? `+1 (${inCart.quantity})` : "Add"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Cart ({cart.length} item{cart.length > 1 ? "s" : ""})
            </p>
            <div className="flex flex-col gap-1.5">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400">
                      Rp {item.product.price.toLocaleString("id-ID")} each
                    </p>
                  </div>
                  {/* Quantity control */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        item.quantity === 1
                          ? removeFromCart(item.product.id)
                          : updateQty(item.product.id, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.product.quantity}
                      value={item.quantity}
                      onChange={(e) => updateQty(item.product.id, e.target.value)}
                      className="w-10 text-center text-sm font-semibold border border-gray-200 rounded py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                    />
                    <button
                      onClick={() => addToCart(item.product)}
                      disabled={item.quantity >= item.product.quantity}
                      className="w-6 h-6 rounded bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-bold flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ＋
                    </button>
                  </div>
                  {/* Subtotal */}
                  <span className="text-sm font-semibold text-gray-700 w-20 text-right shrink-0">
                    Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-300 hover:text-red-400 text-base cursor-pointer transition-colors ml-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center bg-indigo-50 rounded-lg px-4 py-3 mt-1">
              <span className="text-sm font-semibold text-indigo-700">Total</span>
              <span className="text-base font-bold text-indigo-700">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-1">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || cart.length === 0}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {submitting && (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Confirm Transaction
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default TransactionFormModal;
