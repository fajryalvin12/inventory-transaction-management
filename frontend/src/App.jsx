import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import TransactionPage from "./pages/TransactionPage";
import LoginPage from "./pages/LoginPage";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  products: "Products",
  transactions: "Transactions",
};

function AppShell() {
  const { isAuthenticated, signOut, user } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");

  if (!isAuthenticated) return <LoginPage />;

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":     return <Dashboard />;
      case "products":      return <ProductList />;
      case "transactions":  return <TransactionPage />;
      default:              return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar title={PAGE_TITLES[activePage]} user={user} onSignOut={signOut} />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
