import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";

// Pages
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";

function App() {
  return (
    <CartProvider>
      <div className="App min-h-screen bg-background">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<SuccessPage />} />
            <Route path="/checkout/cancel" element={<CancelPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0C0714',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#F8F7FA',
            },
          }}
        />
      </div>
    </CartProvider>
  );
}

export default App;
