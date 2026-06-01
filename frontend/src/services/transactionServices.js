const BASE_URL = "http://localhost:4000/v1";

export async function getTransactionsList({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({ page, limit });
  const response = await fetch(`${BASE_URL}/transactions?${params}`);
  if (!response.ok) throw new Error("Failed to fetch transactions");
  const data = await response.json();
  return data; // { meta, data }
}

export async function getTransactionDetails(id) {
  const response = await fetch(`${BASE_URL}/transactions/${id}`);
  if (!response.ok) throw new Error("Failed to fetch transaction details");
  const data = await response.json();
  return data.data;
}

export async function createTransaction(items) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create transaction");
  return data.data;
}
