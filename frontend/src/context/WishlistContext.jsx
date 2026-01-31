import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const API_URL = `${import.meta.env.VITE_API_URL}/api`;

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setWishlist(res.data.items.map((i) => i.product));
  };

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("NOT_LOGIN");

    if (wishlist.includes(productId)) {
      await axios.delete(`${API_URL}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((id) => id !== productId));
    } else {
      await axios.post(
        `${API_URL}/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setWishlist((prev) => [...prev, productId]);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// eslint-disable-next-line
export const useWishlist = () => useContext(WishlistContext);
