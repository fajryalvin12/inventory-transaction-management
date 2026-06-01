import { useState, useEffect } from "react";
import Modal from "./Modal";

const EMPTY_FORM = { name: "", price: "", quantity: "", status: "Available" };

function ProductFormModal({ isOpen, onClose, onSubmit, product }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sync form when product changes (edit mode)
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: String(product.price),
        quantity: String(product.quantity),
        status: product.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = "Enter a valid price (≥ 0)";
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0)
      e.quantity = "Enter a valid quantity (≥ 0)";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        status: form.status,
      });
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Product" : "Add New Product"}>
      <div className="flex flex-col gap-4">

        {/* Product Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Product Name
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Indomie Goreng"
            className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
              errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Price & Quantity - side by side */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Price (Rp)
            </label>
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 3500"
              className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                errors.price ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Stock Qty
            </label>
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 100"
              className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                errors.quantity ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
          </div>
        </div>

        {/* Status - toggle buttons */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Status
          </label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {["Available", "SoldOut"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setForm((prev) => ({ ...prev, status: s })); }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  form.status === s
                    ? s === "Available"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {s === "Available" ? "✓ Available" : "✕ Sold Out"}
              </button>
            ))}
          </div>
        </div>

        {/* Price preview */}
        {form.price && form.quantity && !errors.price && !errors.quantity && (
          <div className="bg-indigo-50 rounded-lg px-4 py-3 flex justify-between items-center">
            <span className="text-xs text-indigo-500 font-medium">Estimated stock value</span>
            <span className="text-sm font-bold text-indigo-700">
              Rp {(Number(form.price) * Number(form.quantity)).toLocaleString("id-ID")}
            </span>
          </div>
        )}

        {/* Submit error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-xs text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {submitting && (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProductFormModal;
