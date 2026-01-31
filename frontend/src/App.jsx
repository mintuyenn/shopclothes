import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
